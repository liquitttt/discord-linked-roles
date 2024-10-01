# Project Title

Brief description of what the project does and its purpose.

## Table of Contents

- [Project Title](#project-title)
- [Table of Contents](#table-of-contents)
- [Installation](#installation)
- [DB Setup](#db-setup)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/liquitttt/linked-roles.git
    ```

2. Navigate to the project directory:
    ```sh
    cd linked-roles
    ```

3. Install dependencies:
    ```sh
    npm install
    ```

## DB Setup

1. Install `sequelize-cli`:
    ```sh
    npm install sequelize-cli
    ```

2. Change credentials in `config/config.json`.

3. Create database & migrate it from files:
    ```sh
    npx sequelize db:create
    npx sequelize db:migrate
    ```

## Usage

Provide instructions and examples for using the project. For example:

1. Create your own `.env` file from [example.env]().

2. Run the project:
    ```sh
    npm start
    ```

3. Open your browser and go to `http://localhost:3000`

## Contributing

Contributions are welcome! Please follow the following steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch-name`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add new feature'`).
5. Push to the branch (`git push origin feature-branch-name`).
6. Open a Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](https://opensource.org/licenses/MIT) file for more
details.