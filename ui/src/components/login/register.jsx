import React from "react";
import loginImg from "../icon/logo.svg";

export class Register extends React.Component{


    constructor(props)
    {
        super(props)
    }

    render(){
        return <div className="base-container" ref={this.props.containerRef}>
            <div className="header">REGISTER</div>
            <div className="content">
                <div className="image">
                    <img src={loginImg}/>
                </div>
                <div className="form">
                    <div ClassName="form-group">
                        <input type="text" name="username" placeholder="Username"/>
                    </div>
                    <div ClassName="form-group">
                        <input type="text" name="email" placeholder="E-mail"/>
                    </div>
                     <div ClassName="form-group">
                       
                        <input type="text" name="password" placeholder="Password"/>
                    </div>
                    <div ClassName="form-group">
                       
                        <input type="text" name="confirmPassword" placeholder="Confirm Password"/>
                    </div>
                </div>
            </div>
            <div className="footer">
                <button type="button" className="btn">Register</button>
            </div>
        </div>
    }
}