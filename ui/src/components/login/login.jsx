import React from "react";
import loginImg from "../icon/logo.svg";

export class Login extends React.Component{
    constructor(props)
    {
        super(props)
    }

    render(){
        return <div className="base-container" ref={this.props.containerRef}>
            {/* <div className="header">LOGIN</div> */}
            <div className="content">
                <div className="image">
                    <img src={loginImg}/>
                </div>
                <div className="form">
                    <div ClassName="form-group">
                        <input type="text" name="username" placeholder="Username"/>
                    </div>
                     <div ClassName="form-group">
                       
                        <input type="text" name="password" placeholder="Password"/>
                    </div>
                </div>
            </div>
            <div className="footer">
                <button type="button" className="btn">Log In</button>
            </div>
        </div>
    }
}