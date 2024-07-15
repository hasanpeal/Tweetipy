import { useLocation } from "react-router-dom";

function Dashboard(){
    const location = useLocation();
    const {email, username} = location.state;
    return (
        <div>
        <h1> Your email is {email}</h1>
        <h1> Your username is {username}</h1>
        </div>
    )
}

export default Dashboard;