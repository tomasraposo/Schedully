![logo-horizontal](https://user-images.githubusercontent.com/43519486/163183180-75d99505-05df-4875-964d-9fcaf7d7e492.svg)

# FDM Trainer Skills and Availability 

Following FDM's Recruit, Train, Deployment model and its global reach, we developed an end-to-end web app specifically suited to the company's hiring programme. We believe this will greatly facilitate their business model and allow them to achieve their organizational needs in the long term. Most importantly, this project was designed with scalability in mind from the ground up. This means FDM will be capable of managing increased demand for their services.


## Features

### Core
- Advanced filtering options (by course, name, availability, etc)
- Review trainers' availability 
- Slot allocation
- Group notification
- Automatic resolution of double-booking and overlapping slots

### Frontend
- Easy-to-use UI with minimum configuration time
- Dedicated set of control widgets


## Heuristics

Course-trainer allocation is done base on quantifiable constraints:
- Availability
- Expereince
- Skill set
- Duration


## Project Structure

This project utilisies Express, MongoDB, React and Axios to talk from React to Express

```
├── README.md
├── backend         (EXPRESS + MONGODB)
│   ├── models
│   ├── routes
│   └── server.js
├── package-lock.json
├── package.json
├── public          (REACT)
└── src             (REACT)
    ├── App.css
    └── App.js
```

## Available Scripts

In the project directory, you can run:

### `npm run install-all`

Install all dependencies for client-side and server-side

### `npm run dev`

Launches Express and React as one instance
