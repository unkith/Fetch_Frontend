// Imports
import React, { useState, useEffect } from 'react';
import { Col, Container, Row } from "react-bootstrap";


function DogSearcher() {

    // Initializing useStates
    const [dogBreeds, setDogBreeds] = useState([]); // stores a list of all dog breeds available from the API call
    const [selectedBreeds, setSelectedBreeds] = useState([]); // stores a list of all breeds selected by the user
    const [showImages, setShowImages] = useState(false); // variable to check if user wants to see images or not
    const [dogImages, setDogImages] = useState({}); // stores a list of dog images for selected breeds

    useEffect(() => {
        // Fetch the list of dog breeds
        fetch('https://dog.ceo/api/breeds/list/all')
            .then((response) => response.json())
            .then((data) => {
                const newBreeds = [];
                Object.keys(data.message).forEach((key) => {
                    const breedArray = data.message[key];
                    // if the breed has no sub breeds, add it to the dogBreeds array
                    if (breedArray.length === 0) {
                        newBreeds.push(key.charAt(0).toUpperCase() + key.slice(1));
                    } else {
                        // if the breed has sub breeds, add each sub breed to the array 
                        breedArray.forEach((breed) => {
                            newBreeds.push(key.charAt(0).toUpperCase() + key.slice(1) + " " + breed.charAt(0).toUpperCase() + breed.slice(1));
                        });
                    }
                });
                setDogBreeds(newBreeds);
            })
            // error in fetching
            .catch((error) => {
                console.error('Error fetching dog breeds:', error);
            });
    }, []);

    // handles the checkbox being selected and deselected
    const handleToggleBreed = (breed) => {
        if (selectedBreeds.includes(breed)) {
            // if breed was already selected then remove it 
            setSelectedBreeds(selectedBreeds.filter((selectedBreed) => selectedBreed !== breed));
        } else {
            // breed was not selected, add it
            setSelectedBreeds([...selectedBreeds, breed]);
        }
    };

    // handles fetching the dog images 
    const handleShowImages = () => {
        // fetches images for selected breeds
        window.scrollTo(0, 0);
        const fetchImages = async () => {
            const images = {};
            for (const breed of selectedBreeds) {
                // replaces breed names with spaces to the correct format
                const breedWithoutSpaces = breed.toLowerCase().replace(/\s/g, '/');
                const url = `https://dog.ceo/api/breed/${breedWithoutSpaces}/images/random`;
                await fetch(url)
                    .then((response) => response.json())
                    .then((data) => {
                        images[breed] = data.message;
                    })
            }
            // shows the images
            setDogImages(images);
            setShowImages(true);
        };

        fetchImages();
    };

    // when backToSelection is clicked, stop showing the images
    const handleBackToSelection = () => {
        setShowImages(false);
    };

    // Reset button clears the selected breeds
    const handleClearCheckboxes = () => {
        setSelectedBreeds([]);
    };


    // main div
    return (
        <div>
            {/* fetch logo / dog image */}
            <img src="../figures/fetch-dog.png" alt="Image of dog/ Fetch logo" width={"75px"} height={"75px"} />
            <h1> Dog Images</h1>
            <br />
            {/* shows different divs based on what the user wants to see */}
            {showImages ? (
                <div>
                    <button onClick={handleBackToSelection} className='button'>Back to Selection</button>
                    <br />
                    <br />
                    <h2>Selected Dog Images:</h2>
                    <br />
                    {/* Maps every breed in the selectedBreeds to an image */}
                    {selectedBreeds.map((breed, index) => (
                        <div key={index}>
                            <h3>{breed}</h3>
                            {<img src={dogImages[breed]} alt={breed} width={"500px"} height={"375px"} />}
                            <br />
                            <hr />
                        </div>
                    ))}
                </div>
            ) : (
                // When user wants to see the breed list
                <Container>
                    <h2>Select your dog breeds:</h2>
                    <br />
                    <Row>
                        {/* Maps each breed to a checkbox and label  */}
                        {dogBreeds.map((breed, index) => (
                            // 6 cols shown in lg screen, 4 shown on md, 3 shown on sm, 2 shown on xs screen
                            <Col lg={2} md={3} sm={4} xs={6} style={{ paddingBottom: "1.5em" }} key={index}>
                                <Col key={index}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            value={breed}
                                            checked={selectedBreeds.includes(breed)}
                                            onChange={() => handleToggleBreed(breed)}
                                            style={{ color: "#FFA900" }}
                                        />
                                    </label>
                                </Col>
                                <Col className='dog_selectors'>{breed}</Col>
                                <hr />
                            </Col>
                        ))}
                    </Row>
                    {/* buttons to show images and reset checkboxes */}
                    <div className='row'>
                        <button onClick={handleShowImages} className='button m-1'>Show Images</button>
                        <br />
                        <button onClick={handleClearCheckboxes} className='m-1 btn btn-danger'>Reset</button>
                    </div>
                </Container>
            )}
        </div>
    );
}

// export
export default DogSearcher;
