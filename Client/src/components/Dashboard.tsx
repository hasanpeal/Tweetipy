import { useLocation } from "react-router-dom";

function Dashboard(){
    const location = useLocation();
    const {email} = location.state;
    return (
        <h1> Your email is {email}</h1>
    )
}

export default Dashboard;