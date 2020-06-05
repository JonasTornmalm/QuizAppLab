import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import authService from './api-authorization/AuthorizeService'

export class Home extends Component {
  static displayName = Home.name;

    render() {
        return (
            <div className="centerNicely">
                <div>
                    <h1>Welcome to my quiz app!</h1>
                    <div>
                        <Link to={"/Quiz"} className="w-50 mt-3 btn btn-info">Play Game</Link>
                    </div>
                </div>
            </div>
        );
    }

}