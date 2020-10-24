const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

let empList =[];

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```

const empQs = [
    {
        type:"input",
        message:"Please type your name",
        name:"name"
    },
    {
        type:"input",
        message:"What's your ID",
        name:"id"
    },
    {
        type:"input",
        message:"Type your email",
        name:"email"
    },
    {
        type:"list",
        message:"What is your title?",
        name:"role",
        choices: [
            "Manager",
            "Engineer",
            "Intern"    
        ]
        
    },
];

const engQs = [
	{
		type: "input",
		message: "What is the GitHub user-name?",
		name: "github"
	}
];

const mgmtQs = [
	{
		type: "input",
		message: "What is your office number?",
		name: "number"
	}
];

const internQs = [
	{
		type: "input",
		message: "What school do you attend?",
		name: "school"
	}
];

const newQs = [
    {
    type:"list",
        message:"Anymore employees?",
        name:"more",
        choices: [
            "Yes",
            "That's all!"    
        ]
    }
];

function makeTeam() {
	inquirer
		.prompt(empQs)
		.then(answers => {
			switch (answers.role) {
				case "Engineer":
					inquirer.prompt(engQs).then(engineerAnswers => {
						const engineerInfo = new Engineer(
							answers.name,
							answers.id,
							answers.email,
							engineerAnswers.github
                        );
						empList.push(engineerInfo);
						restart();
					});
					break;
				case "Manager":
					inquirer.prompt(mgmtQs).then(managerAnswers => {
						const managerInfo = new Manager(
							answers.name,
							answers.id,
							answers.email,
							managerAnswers.number
						);
						empList.push( managerInfo)
				 		restart();
					});
					break;
				case "Intern":
					inquirer
						.prompt(internQs).then( internAnswers => {
							const internInfo = new Intern(
								answers.name,
								answers.id,
								answers.email,
								internAnswers.school
							);
							empList.push(internInfo);
							restart();
						});
					break;
			}
		})
		.catch(err => {
			throw err;
        });
        
}

makeTeam();

function restart() {
	inquirer.prompt(newQs).then(answer => {
		switch (answer.more) {
			case "Yes":
				makeTeam();
				break;

			case "That's all!":
				makeHTML();
				break;
		}
	});
}


function makeHTML() {
		const newData = render(empList);
		fs.writeFile(outputPath, newData, "utf8", err => {
			if (err) return console.log(err);
		});
		console.log("success");
	// });
}
// ---------------------------------------------------
