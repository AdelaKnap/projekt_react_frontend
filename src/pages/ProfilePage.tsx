import { useAuth } from "../context/AuthContext";

const ProfilePage = () => {
    const { user } = useAuth();

    console.log("Användare från context:", user);
    console.log("Användar-ID:", user?._id); 

    return (
        <div>
            <h1>Hej {user?._id || "Ingen användare"}</h1>


        </div>
    );
};

export default ProfilePage;
