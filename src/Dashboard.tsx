import { useState, useEffect } from "react";
import { auth, storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./App.css"; // Reusing App.css for now, can be separated later

export default function Dashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [resumeUrl, setResumeUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);
                checkResume(firebaseUser.uid);
            } else {
                navigate("/");
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [navigate]);

    const checkResume = async (userId: string) => {
        const resumeRef = ref(storage, `users/${userId}/resume.pdf`);
        try {
            const url = await getDownloadURL(resumeRef);
            setResumeUrl(url);
        } catch (err) {
            // File doesn't exist or other error
            setResumeUrl(null);
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
        navigate("/");
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        if (file.type !== "application/pdf") {
            setError("Please upload a PDF file.");
            return;
        }

        setUploading(true);
        setError("");

        const resumeRef = ref(storage, `users/${user.uid}/resume.pdf`);
        try {
            await uploadBytes(resumeRef, file);
            const url = await getDownloadURL(resumeRef);
            setResumeUrl(url);
        } catch (err) {
            console.error("Upload error:", err);
            setError("Failed to upload resume. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteResume = async () => {
        if (!user || !resumeUrl) return;

        if (!confirm("Are you sure you want to delete your resume?")) return;

        const resumeRef = ref(storage, `users/${user.uid}/resume.pdf`);
        try {
            await deleteObject(resumeRef);
            setResumeUrl(null);
        } catch (err) {
            console.error("Delete error:", err);
            setError("Failed to delete resume. Please try again.");
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="header-content">
                    <div className="logo-section">
                        <h1>Resume AI</h1>
                    </div>
                    <div className="user-controls">
                        <span className="user-email">{user?.email}</span>
                        <button onClick={handleLogout} className="text-button logout-button">
                            Sign Out
                        </button>
                    </div>
                </div>
            </header>

            <main className="dashboard-content">
                <div className="content-wrapper">
                    <div className="section-header">
                        <h2>Your Resume</h2>
                        <p className="section-subtitle">Manage your resume file</p>
                    </div>

                    {error && <div className="error-banner">{error}</div>}

                    {resumeUrl ? (
                        <div className="file-card">
                            <div className="file-icon-large">
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#4a90e2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M14 2V8H20" stroke="#4a90e2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M16 13H8" stroke="#4a90e2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M16 17H8" stroke="#4a90e2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M10 9H8" stroke="#4a90e2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div className="file-info">
                                <h3>resume.pdf</h3>
                                <p>PDF Document</p>
                            </div>
                            <div className="file-actions">
                                <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="action-button primary">
                                    View
                                </a>
                                <button onClick={handleDeleteResume} className="action-button danger">
                                    Delete
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="upload-zone">
                            <div className="upload-content">
                                <div className="upload-icon">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <h3>Upload your resume</h3>
                                <p>PDF files only</p>
                                <label className="upload-button-wrapper">
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleFileUpload}
                                        disabled={uploading}
                                        className="file-input"
                                    />
                                    <span className={`primary-button ${uploading ? 'disabled' : ''}`}>
                                        {uploading ? "Uploading..." : "Select File"}
                                    </span>
                                </label>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
