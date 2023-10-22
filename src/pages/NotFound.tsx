import { Link } from "react-router-dom"

export const NotFound = () => {
    return (
        <div>
            <h1>404 Requested Page Not Found</h1>
            <p> Check your url. </p>
            <Link to='/'>Back to main page.</Link>
        </div>
    )
}   