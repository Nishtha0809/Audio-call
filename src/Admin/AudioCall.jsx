import React, { useEffect, useRef, useState } from "react";
import "../Styles/AudioCall.css";
import socket from "../socket";

// NEW
import axios from "axios";

function AudioCall() {

  const [onlineUsers, setOnlineUsers] = useState([]);
  const [incomingCall, setIncomingCall] = useState(null);
  const [activeCallUser, setActiveCallUser] = useState(null);
  const [socketConnected, setSocketConnected] = useState(socket.connected);

  // NEW
  // recording status
  const [isRecording, setIsRecording] = useState(false);

  // NEW
  // recorded audio url
  const [recordingURL, setRecordingURL] = useState("");

  // NEW
  // store recordings from database
  const [savedRecordings, setSavedRecordings] =
    useState([]);

  const localStream = useRef(null); //Stores: your microphone audio stream
  const peerConnection = useRef(null); // Stores: WebRTC connection object
  const remoteAudioRef = useRef(null); // Points to: <audio/> tag.Used to play other user's voice.

  const mediaRecorder = useRef(null); //records audio
  const recordedChunks = useRef([]); //stores recorded data
  const remoteStream = useRef(null); //stores other user's stream

  const myEmail = localStorage.getItem("email");

  useEffect(() => {

    console.log("AudioCall Mounted");
    console.log("My Email:", myEmail);

    if (!myEmail) return;

    const handleUsers = (users) => {

      console.log("Users:", users);

      setOnlineUsers([...users]);

    };

    const handleConnect = () => {

      setSocketConnected(true);

      socket.emit("join", myEmail);

    };

    const handleDisconnect = () => {

      setSocketConnected(false);

    };

    const handleIncomingCall = ({ from, offer }) => {

      setIncomingCall({ from, offer });

    };

    const handleCallAnswered = async ({ answer }) => {

      if (peerConnection.current) {

        await peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(answer)
        );
      }
    };

    const handleIce = async ({ candidate }) => {

      if (peerConnection.current && candidate) {

        await peerConnection.current.addIceCandidate(
          new RTCIceCandidate(candidate)
        );
      }
    };

    const handleCallRejected = () => {

      alert("Call rejected");

      endCall(false);

    };

    const handleCallEnded = () => {

      alert("Call ended");

      endCall(false);

    };

    socket.on("connect", handleConnect);

    socket.on("disconnect", handleDisconnect);

    socket.on("online-users", handleUsers);

    socket.on("incoming-call", handleIncomingCall);

    socket.on("call-answered", handleCallAnswered);

    socket.on("ice-candidate", handleIce);

    socket.on("call-rejected", handleCallRejected);

    socket.on("call-ended", handleCallEnded);

    if (socket.connected) {

      socket.emit("join", myEmail);

    }

    // NEW
    // load recordings
    fetchRecordings();

    return () => {

      socket.off("connect", handleConnect);

      socket.off("disconnect", handleDisconnect);

      socket.off("online-users", handleUsers);

      socket.off("incoming-call", handleIncomingCall);

      socket.off("call-answered", handleCallAnswered);

      socket.off("ice-candidate", handleIce);

      socket.off("call-rejected", handleCallRejected);

      socket.off("call-ended", handleCallEnded);

    };

  }, [myEmail]);

  // ==========================================
  // FETCH RECORDINGS
  // ==========================================

  const fetchRecordings = async () => {

    try {

      const res = await axios.get(

        `http://localhost:3002/api/recordings?email=${myEmail}`
      );
      setSavedRecordings(res.data);

    } catch (error) {

      console.log(error);
    }
  };

  const createPeerConnection = (targetUser) => {

    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" }
      ] //helps browsers discover public IPs.
    });

    //This creates: direct browser-to-browser audio connection

    pc.onicecandidate = (event) => {

      if (event.candidate) {

        socket.emit("ice-candidate", {

          to: targetUser,

          candidate: event.candidate

        }); //fires when browser discovers network routes.

      }

    };

    pc.ontrack = (event) => {

      remoteStream.current = event.streams[0];

      if (remoteAudioRef.current) {

        remoteAudioRef.current.srcObject =
          event.streams[0];

      }

    };

    return pc;

  };

  const startCall = async (user) => {

    try {

      localStream.current =
        await navigator.mediaDevices.getUserMedia({
          audio: true
        });

    } catch (error) {

      alert(
        "Microphone not found or permission denied. Please connect/enable a microphone."
      );

      console.error(error);

      return;

    }

    peerConnection.current =
      createPeerConnection(user);

    localStream.current.getTracks().forEach((track) => {

      peerConnection.current.addTrack(
        track,
        localStream.current
      );

    });

    const offer =
      await peerConnection.current.createOffer();

    await peerConnection.current.setLocalDescription(
      offer
    );

    socket.emit("call-user", {

      to: user,

      from: myEmail,

      offer

    }); //Frontend sends audio call request to server

    setActiveCallUser(user);

    // NEW
    // auto start recording after 2 sec

    setTimeout(() => {

      startRecording();

    }, 2000);

  };

  const acceptCall = async () => {

    localStream.current =
      await navigator.mediaDevices.getUserMedia({
        audio: true
      });

    peerConnection.current =
      createPeerConnection(incomingCall.from);

    localStream.current.getTracks().forEach((track) => {

      peerConnection.current.addTrack(
        track,
        localStream.current
      );

    });

    await peerConnection.current.setRemoteDescription(
      new RTCSessionDescription(
        incomingCall.offer
      )
    );

    const answer =
      await peerConnection.current.createAnswer();

    await peerConnection.current.setLocalDescription(
      answer
    );

    socket.emit("answer-call", {

      to: incomingCall.from,

      answer
    });

    setActiveCallUser(incomingCall.from);

    setIncomingCall(null);

    // NEW
    // auto start recording after call accept

    setTimeout(() => {

      startRecording();

    }, 2000);
  };

  const rejectCall = () => {

    if (incomingCall) {

      socket.emit("reject-call", {
        to: incomingCall.from
      });
    }
    setIncomingCall(null);
  };

  // NEW
  // START RECORDING FUNCTION

  const startRecording = () => {

    // clear old recording
    recordedChunks.current = [];

    // combine local + remote audio tracks
    const combinedStream = new MediaStream([

      ...localStream.current.getTracks(),

      ...(remoteStream.current
        ? remoteStream.current.getTracks()
        : [])

    ]);

    mediaRecorder.current =
      new MediaRecorder(combinedStream); //MediaRecorder records audio in chunks.

    mediaRecorder.current.ondataavailable =
      (event) => {

        if (event.data.size > 0) {

          recordedChunks.current.push(
            event.data //is a small audio piece.
          );
        }
      };

    // when recording stops all chunks combine into single audio file.
    mediaRecorder.current.onstop =
      async () => {

        const blob = new Blob(
          recordedChunks.current,
          {
            type: "audio/webm"
          }
        );

        const audioURL =
          URL.createObjectURL(blob);

        setRecordingURL(audioURL);

        // =====================================
        // SAVE RECORDING INTO DATABASE
        // =====================================

        try {

          // CREATE FILE FROM BLOB Because backend upload works better with files.
          const file = new File(
           [blob],
            "recording.webm",
            {
              type: "audio/webm"
            }
          );

          // FORM DATA

          const formData = new FormData();

          formData.append(
            "audio",
            file
          );

          formData.append(
            "caller",
            myEmail
          );

          formData.append(
            "receiver",
            activeCallUser
          );

          // SEND TO BACKEND

          await axios.post(

            "http://localhost:3002/api/recordings",

            formData,

            {
              headers: {
                "Content-Type":
                  "multipart/form-data"
              }
            }

          );

          fetchRecordings();

        } catch (error) {

          console.log(error);

        }

      };

    mediaRecorder.current.start();

    setIsRecording(true);

    alert("Recording Started");

  };

  // NEW
  // STOP RECORDING FUNCTION

  const stopRecording = () => {

    if (mediaRecorder.current) {

      mediaRecorder.current.stop();

      setIsRecording(false);

      alert("Recording Stopped");

    }

  };

  // NEW
  // DELETE RECORDING FUNCTION

  const deleteRecording = async (id) => {

    try {

      await axios.delete(

        `http://localhost:3002/api/recordings/${id}`

      );

      fetchRecordings();

    } catch (error) {

      console.log(error);

    }

  };

  const endCall = (notifyOtherUser = true) => {

    if (notifyOtherUser && activeCallUser) {

      socket.emit("end-call", {
        to: activeCallUser
      });

    }

    // NEW
    // stop recording if call ends

    if (mediaRecorder.current && isRecording) {

      mediaRecorder.current.stop();

      setIsRecording(false);

    }

    if (peerConnection.current) {

      peerConnection.current.close();

      peerConnection.current = null;

    }

    if (localStream.current) {

      localStream.current
        .getTracks()
        .forEach((track) => track.stop());

      localStream.current = null;

    }

    if (remoteAudioRef.current) {

      remoteAudioRef.current.srcObject = null;

    }

    setIncomingCall(null);

    setActiveCallUser(null);

  };

  return (

    <div className="audio-container">

      {/* USER EMAIL */}
      <button className="user-email">
        {myEmail}
      </button>

      {/* TITLE */}
      <h2 className="audio-title">
        Audio Call
      </h2>

      {/* SOCKET STATUS */}
      <p className="status-text">

        Socket: {

          socketConnected
            ? "connected"
            : "not connected"

        }

      </p>

      {/* ONLINE USERS */}
      <p className="status-text">

        Online users: {

          onlineUsers.length
            ? onlineUsers.join(", ")
            : "none"

        }

      </p>

      {/* AUDIO TAG */}
      <audio
        ref={remoteAudioRef}
        autoPlay
      />

      {/* EMAIL NOT FOUND */}
      {

        !myEmail && (

          <p style={{ color: "red" }}>

            Email not found in localStorage

          </p>

        )

      }

      {/* USERS LIST */}
      <div className="users-list">

        {

          onlineUsers
            .filter(
              (user) => user !== myEmail
            )
            .map((user) => (

              <div
                key={user}
                className="user-card"
              >

                <span>{user}</span>

                <button
                  className="call-btn"
                  onClick={() => startCall(user)}
                  disabled={Boolean(activeCallUser)}
                >

                  Call

                </button>

              </div>

            ))

        }

      </div>

      {/* INCOMING CALL UI */}
      {

        incomingCall && (

          <div className="incoming-call-box">

            <h3>
              {incomingCall.from} is calling...
            </h3>

            <button
              className="accept-btn"
              onClick={acceptCall}
            >

              Accept

            </button>

            <button
              className="reject-btn"
              onClick={rejectCall}
            >

              Reject

            </button>

          </div>

        )

      }

      {/* ACTIVE CALL UI */}
      {

        activeCallUser && (

          <div className="active-call-box">

            <p>
              In call with {activeCallUser}
            </p>

            {

              !isRecording ? (

                <button
                  className="record-btn"
                  onClick={startRecording}
                >

                  Start Recording

                </button>

              ) : (

                <button
                  className="stop-record-btn"
                  onClick={stopRecording}
                >

                  Stop Recording

                </button>

              )

            }

            <button
              className="end-btn"
              onClick={() => endCall(true)}
            >

              End Call

            </button>

          </div>

        )

      }

      {/* NEW */}
      {/* PLAY RECORDED AUDIO */}

      {

        recordingURL && (

          <div className="recording-box">

            <h3>
              Recorded Call
            </h3>

            <audio
              controls
              src={recordingURL}
            />

          </div>

        )

      }

      {/* ========================================= */}
      {/* SAVED RECORDINGS */}
      {/* ========================================= */}

      <div className="recordings-container">

        <h2>
          Saved Recordings
        </h2>

        {

          savedRecordings.map((recording) => (

            <div
              key={recording._id}
              className="recording-card"
            >

              <p>

                <strong>Caller:</strong>
                {recording.caller}

              </p>

              <p>

                <strong>Receiver:</strong>
                {recording.receiver}

              </p>

              <audio controls>

                <source
                  src={`http://localhost:3002${recording.recordingUrl}`}
                  type="audio/webm"
                />

              </audio>

              <br />

              <button
                className="delete-record-btn"
                onClick={() =>
                  deleteRecording(recording._id)
                }
              >

                Delete Recording

              </button>

            </div>

          ))

        }

      </div>

    </div>

  );

}

export default AudioCall;