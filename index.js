import fs from 'fs';

// console.log(fs);

import { randomUUID } from 'crypto';

// const uuid = randomUUID();

// console.log(uuid);



fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }
    try {
        const old_o = JSON.parse(data);

        const sections_a = [];

        for(const section_s in old_o) {
            const section_o = {};
            section_o.id = randomUUID();
            section_o.name = section_s.trim();
            const questions_a = [];
            for(const question_s in old_o[section_s]) {
                const question_o = {
                    id: randomUUID(),
                    name: question_s.trim(),
                    answers: [],
                    explanation: '',
                    image: ''
                };
                for(const answer_s in old_o[section_s][question_s]) {
                    if(answer_s === 'id') {
                        continue;
                    }
                    const answer_o = {
                        id: randomUUID(),
                        name: answer_s.trim(),
                        isCorrect: old_o[section_s][question_s][answer_s]
                    }
                    question_o.answers.push(answer_o);
                }
                
                questions_a.push(question_o);
            }
            section_o.questions = questions_a;
            sections_a.push(section_o);
        }

        console.dir(sections_a, { depth: null });


        // console.log(jsonObject);
        const jsonString = JSON.stringify(sections_a, null, 2);

        try {
            fs.writeFileSync('refactored.json', jsonString);
            console.log('JSON file saved successfully');
        } catch (error) {
            console.error('Error writing JSON file:', error);
        }
        // You can now use jsonObject as a regular JavaScript object
    } catch (parseErr) {
        console.error('Error parsing JSON:', parseErr);
    }
});