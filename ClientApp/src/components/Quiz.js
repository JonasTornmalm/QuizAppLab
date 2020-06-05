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
            currentScore: 0,
            hasAnswered: false,
            completed: false,
            scoreSaved: false
        };


        this.getQuestions = this.getQuestions.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.incrementScore = this.incrementScore.bind(this);
        this.nextQuestionHandler = this.nextQuestionHandler.bind(this);
        this.playAgain = this.playAgain.bind(this);
    }

    componentDidMount() {
        this.getQuestions();
    }

    render() {
        let contents = "";
        if (this.state.loading) {
            contents = <p><em>Loading...</em></p>
        }
        else if (!this.state.completed) {
            contents = this.renderQuestions(this.state.questionBank[this.state.questionIndex]);
        }
        else {
            contents = this.renderFinalScore();
        }
        return (
            <div>
                <div className="text-center m-5">
                    <h1>Score</h1>

                    <p aria-live="polite">Score: <strong>{this.state.currentScore}</strong></p>
                </div>
                <div>
                    {contents}
                </div>
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
                                <button id={answer.id} className="btn btn-primary btn-sm btn-block" onClick={() => this.handleClick(answer)}>{answer.answerText}</button>
                            </li>
                            )}
                        </ul>
                    <div>
                        <button id="nextButton" hidden={!this.state.hasAnswered} className="mt-5 btn btn-primary btn-lg btn-block" onClick={this.nextQuestionHandler}>Next</button>
                    </div>
                </div>
            </div>
        );
    }

    renderFinalScore() {
        let endScreen = "";
        if (!this.state.scoreSaved) {
            endScreen = <p className="text-center"><em>Saving score to database...</em></p>
        }
        else {
            endScreen = <h1 className="text-center">Congratulations! You're final score is {this.state.currentScore}</h1>
        }
        return (
            <div>
                <div>
                    {endScreen}
                </div>
                <div className="text-center m-5">
                    <button id="playAgain" hidden={!this.state.scoreSaved} className="mt-5 btn btn-warning btn-lg btn-block" onClick={this.playAgain}>Play Again</button>
                </div>
            </div>
            );
    }

    playAgain() {
        this.setState({
            questionBank: [],
            questionIndex: 0,
            loading: true,
            currentScore: 0,
            hasAnswered: false,
            completed: false,
            scoreSaved: false
        });
        this.getQuestions();
    }

    incrementScore() {
        this.setState({
            currentScore: this.state.currentScore + 1
        });
    }

    nextQuestionHandler() {
        if (this.state.questionIndex + 1 <= this.state.questionBank.length) {
            this.setState({
                questionIndex: this.state.questionIndex + 1,
                hasAnswered: false
            })
        }
        if (this.state.questionIndex + 1 == this.state.questionBank.length) {
            this.setState({
                completed: true
            })
            if (this.state.currentScore > 0) {
                this.saveScore();
            }
            else {
                this.setState({
                    scoreSaved: true
                })
            }
            
        }
    }

    async handleClick(answer) {
        if (this.state.hasAnswered) {
            return;
        }
        const token = await authService.getAccessToken();
        let listButton = document.getElementById(answer.id);

        let answerResponse = await fetch("answers/" + answer.id, {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        })
            .then(response => response.json())
            .then((jsonresponse) => { return jsonresponse });

        if (answerResponse.isCorrect) {
            listButton.classList.replace('btn-primary', 'btn-success');
            this.incrementScore();
        }
        else {
            listButton.classList.replace('btn-primary', 'btn-danger');
            document.getElementById(answerResponse.correctAnswer).classList.replace('btn-primary', 'btn-success');
        }
        this.setState({ hasAnswered: true }); 
    }

    async saveScore() {
        console.log(this.state.currentScore);
        const token = await authService.getAccessToken();

        if (token != null) {
            let options =
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    score: this.state.currentScore
                })
            };
            console.log(options.body);
            await fetch('savescore', options)
                .then((response) => {
                    if (response.ok) {
                        this.setState({ scoreSaved: true });
                    }
                });
        }
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