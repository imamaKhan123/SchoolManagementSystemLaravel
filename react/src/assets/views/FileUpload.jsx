import React, { useState } from "react";
import axiosClient from "../../axios-client.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { useStateContext } from "../../contexts/ContextProvider.jsx";

const DocumentUpload = () => {
    const [files, setFiles] = useState([]);
    const [documentType, setDocumentType] = useState(""); // State for document type
    const { id } = useParams(); // Get student ID from the URL
    const navigate = useNavigate(); // Initialize navigate function
    const [profilePicture, setProfilePicture] = useState(null);
    const { user, setNotification } = useStateContext();

    const handleFileChange = (e) => {
        setFiles(e.target.files);
    };
    const handleGoBack = () => {
        navigate(-1); // Navigate back to the previous page
    };
    const handleTypeChange = (e) => {
        setDocumentType(e.target.value); // Update the selected document type
    };
    const handleProfilePictureChange = (e) => {
        setProfilePicture(e.target.files[0]); // Set the profile picture
    };

    const handleUpload = async () => {
        if (!documentType) {
            alert("Please select a document type before uploading.");
            return;
        }

        const formData = new FormData();
        Array.from(files).forEach((file) => formData.append("documents[]", file));
        formData.append("type", documentType); // Include the selected document type

         // If profile picture is selected, add it to form data
         if (profilePicture) {
            formData.append("profile_picture", profilePicture);
        }

        try {
            // Pass the student ID in the API endpoint
            const response = await axiosClient.post(`students/${id}/upload-documents`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setNotification("Upload successful!");
             setFiles(null);
        } catch (error) {
            console.error("Error uploading documents", error);
            setNotification("Upload failed.");
        }
    };

    return (
        <div style={{ maxWidth: "500px", margin: "0 auto", padding: "20px" }}>
            <h2>Upload Documents for Student ID: {id}</h2>
            
            {/* Dropdown for selecting document type */}
            <div style={{ marginBottom: "10px" }}>
                <label htmlFor="documentType" style={{ marginRight: "10px" }}>
                    Document Type:
                </label>
                <select
                    id="documentType"
                    value={documentType}
                    onChange={handleTypeChange}
                    style={{ padding: "5px", width: "100%" }}
                >
                    <option value="" disabled>
                        -- Select Document Type --
                    </option>
                    <option value="birth_certificate">Birth Certificate</option>
                    <option value="report_card">Report Card</option>
                    <option value="passport">Passport</option>
                    <option value="proof_of_address">Proof of Address</option>
                </select>
            </div>

            {/* File input for uploading documents */}
            <div style={{ marginBottom: "10px" }}>
                <label htmlFor="files" style={{ marginRight: "10px" }}>
                    Select Files:
                </label>
                <input
                    id="files"
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    style={{ padding: "5px", width: "100%" }}
                />
            </div>
             {/* File input for profile picture */}
             <div style={{ marginBottom: "10px" }}>
                <label htmlFor="profilePicture" style={{ marginRight: "10px" }}>
                    Profile Picture:
                </label>
                <input
                    id="profilePicture"
                    type="file"
                    onChange={handleProfilePictureChange}
                    style={{ padding: "5px", width: "100%" }}
                />
            </div>

            <button onClick={handleUpload} style={{ padding: "10px 20px", backgroundColor: "#5b08a7", color: "#fff", borderColor: "#5b08a7", borderRadius: "5px" }}>
                Upload
            </button>
            &nbsp;
            <button    onClick={handleGoBack} style={{ padding: "10px 20px", color:"#5b08a7",backgroundColor: "#fff", borderColor: "#5b08a7", borderRadius: "5px" }}>
                Go Back
            </button>
        </div>
    );
};

export default DocumentUpload;
