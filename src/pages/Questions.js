import { Box } from "@mui/system";
import { Typography, Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useAxios from "../hooks/useAxios";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { handleScoreChange } from "../redux/actions";
import { decode } from "html-entities";


const getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
}

const Questions = () => {
    const {
        question_category,
        question_difficulty,
        question_type,
        amount_of_question,
        score
    } = useSelector(state => state);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    // console.log(question_category, question_difficulty, question_type, amount_of_question);
    let apiUrl = `/api.php?amount=${amount_of_question}&category=${question_category}&difficulty=${question_difficulty}&type=${question_type}`;
    const { response, loading } = useAxios({ url: apiUrl })
    console.log(response);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [options, setOptions] = useState([]);

    useEffect(() => {
        if (response?.results.length) {
            const question = response.results[questionIndex];
            let answers = [...question.incorrect_answers];
            answers.splice(
                getRandomInt(answers.length),
                0,
                question.correct_answer
            );
            setOptions(answers);
        }
    }, [response, questionIndex]);

    if (loading) {
        return (
            <Box mt={20}>
                <CircularProgress />
            </Box>
        )
    }

    const handleClickAnswer = (e) => {
        const question = response.results[questionIndex];
        if (e.target.textContent === question.correct_answer) {
            dispatch(handleScoreChange(score + 1))
        }

        if (questionIndex + 1 < response.results.length) {
            setQuestionIndex(questionIndex + 1);
        } else {
            navigate("/score");
        }
    }

    return (
        <Box>
            <Typography variant="h4">Question {questionIndex + 1} / {response.results.length}</Typography>
            <Typography mt={5} fontWeight="bold">
                {decode(response.results[questionIndex].question)}
            </Typography>
            {options.map((data, index) => (
                <Box mt={2} key={index}>
                    <Button
                        onClick={handleClickAnswer}
                        fullWidth
                        size="large"
                        color="primary"
                        variant="contained">
                        {decode(data)}
                    </Button>
                </Box>
            ))}
            <Box mt={5} fontWeight="bold">Score: {score} / {response.results.length}</Box>
        </Box>
    );
}

export default Questions;