import * as React from 'react';
import { Link } from "react-router-dom"

export const ClearConfig = () => {
    React.useEffect(() => {
        localStorage.clear()
    }, [])
    return (
        <div>
            <h1>当前的检定的参数已经清除</h1>
            <p> LocalStorage cleared </p>
            <a href='/'>  返回主页  </a>
        </div>
    )
}   