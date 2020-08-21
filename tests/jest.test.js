
const addNums = (num1, num2) => num1 + num2;

test('test addNums function', () => {
    expect(addNums(1, 2)).toBe(3);
});

const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();
const { API_URL } = process.env;

test('test device array', () => {
    expect.assertions(1);
    return axios.get(`${API_URL}/devices`)
    .then(resp => resp.data)
    .then(resp => {
        console.log(resp[0]);
        // expect(resp[0].user).toEqual('mary123');
        expect(resp[0].name).toEqual("Mary's iPhone");
    });

});

test('test user array', () => {
    // expect.assertions(1);
    axios.get(`${API_URL}/users`)
    .then(resp => resp.data)
    .then(resp => {
        console.log(resp[0]);
        expect(resp[0].name).toEqual("Alexa");
    });

});