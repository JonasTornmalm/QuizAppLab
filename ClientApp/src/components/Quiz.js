import React, { Component } from 'react';
import authService from './api-authorization/AuthorizeService'

export class Quiz extends Component {
  static displayName = Quiz.name;

    constructor(props) {
        super(props);
        this.state = {
            questions: [],
            questionIndex: 0,
            loading: true
        };


        this.getAllQuestions = this.getQuestions.bind(this);
    }

    componentDidMount() {
        this.getQuestions();
    }

    static renderQuestionsTable(question) {
        return (
            <table className='table table-striped' aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>Questions text</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{question.questionText}</td>
                    </tr>
                    {question.answers.map(answer =>
                        <tr key={answer.id}>
                            <td>{answer.answerText}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : Quiz.renderQuestionsTable(this.state.questions[this.state.questionIndex]);

        return (
            <div>
                <h1 id="tabelLabel">Questions</h1>
                <p>This component demonstrates fetching data from the server.</p>
                {contents}
            </div>
        );
    }

    async getQuestions() {
        const token = await authService.getAccessToken();
        const response = await fetch('questions', {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        this.setState({ questions: data, loading: false });
    }
}