import React, { Component } from 'react';
import authService from './api-authorization/AuthorizeService'
import { User } from 'oidc-client';

export class Quiz extends Component {
  static displayName = Quiz.name;

    constructor(props) {
        super(props);
        this.state = {
            questionBank: [],
            questionIndex: 0,
            loading: true,
            score: 0,
            userAnswer: null,
            disabled: true
        };


        this.getAllQuestions = this.getQuestions.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        this.getQuestions();
    }

    render() {
        let contents = "";
        if (this.state.loading) {
            contents = <p><em>Loading...</em></p>
        }
        else {
            contents = this.renderQuestions(this.state.questionBank[this.state.questionIndex]);
        }
        return (
            <div>
                <h1 id="tabelLabel">Questions</h1>
                <p>Render Questions</p>
                {contents}
            </div>
        );
    }

    renderQuestions(questionBank) {
        console.log(questionBank);
        return (
            <div className="container">
                <div className="list-group">
                    <h3 className="list-group-item list-group-item-action flex-column align-items-start active">{questionBank.questionText}</h3>
                        <ul className="list-group">
                        {questionBank.answers.map(answer =>
                            <li key={answer.id} className="list-group-item d-flex justify-content-between align-items-center">
                                <button id={answer.id} onClick={() => this.handleClick(answer)}>{answer.answerText}</button>
                            </li>
                            )}
                        </ul>
                    <div>
                        <button className="btn btn-primary btn-lg btn-block">Next</button>
                    </div>
                </div>
            </div>
        );
    }

    async handleClick(answer) {
        console.log(answer.answerText);

        const response = await fetch('answers' + answer.id)
        const data = await response.json();
        console.log(data);
    }



    async getQuestions() {
        const token = await authService.getAccessToken();
        const response = await fetch('questions', {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        console.log(data);
        this.setState(
            {
                questionBank: data,
                loading: false
            });
    }
}