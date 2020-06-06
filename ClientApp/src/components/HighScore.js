import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import authService from './api-authorization/AuthorizeService'

export class HighScore extends Component {
    static displayName = HighScore.name;

    constructor(props) {
        super(props);
        this.state = {
            highscores: [],
            loading: true
        };

        this.getHighscores = this.getHighscores.bind(this);
    }

    componentDidMount() {
        this.getHighscores();
    }

    render() {
        let content = "";
        let tableHeader = "";
        if (this.state.loading) {
            tableHeader = <td></td>
            content = <tr><td>Loading...</td></tr>
        }
        else {
            tableHeader = this.renderHighscoreTableHeader();
            content = this.renderHighscoreTable();
        }
        return (
            <div className="centerNicely">
                <div>
                    <h1 className="title">Highscore</h1>
                    <table id='highscores'>
                        <tbody>
                            <tr>{tableHeader}</tr>
                            {content}
                        </tbody>
                    </table>
                </div>
                <div>
                    <Link to={"/"} className="w-50 mt-3 btn btn-success">Back to menu</Link>
                </div>
            </div>
        );
    }

    renderHighscoreTableHeader() {
        let header = Object.keys(this.state.highscores[0])
        return header.map((key, index) => {
            return <th key={index}>{key.toUpperCase()}</th>
        })
    }

    renderHighscoreTable() {
        return this.state.highscores.map((scoreItem, index) => {
            const { id, userName, result, date } = scoreItem
            return (
                <tr key={id}>
                    <td>{id}</td>
                    <td>{userName}</td>
                    <td>{result}</td>
                    <td>{date}</td>
                </tr>
            )
        })
    }

    async getHighscores() {
        const token = await authService.getAccessToken();
        const response = await fetch('highscores', {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        console.log(data);
        this.setState(
            {
                highscores: data,
                loading: false
            });
    }
}