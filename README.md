Welcome to Web Dev!
===================
You are one hour away from becoming a pro!
Let's build a web app.
  
Prerequisites
-----
1. Web Server
    * Serves the page(s) we create. Though, we could also see how files look without a server. 
    * In this tutorial we will be using apache(httpd): http://httpd.apache.org/docs/current/install.html
    * We will save the web pages under /var/www/html - this is apache's default location
    * Test apache is running : open a browser and go to http://localhost
    * Create a test file (any extension or no extension) under /var/www/html and make sure you can access it http://localhost/test

2. Editor
    * whatever you want (atom, sublime, notepad++, vim, bunch of others)
    * I will be using IntelliJ IDEA


What functionality are we building?
-----
User Stories (https://www.agilealliance.org/glossary/user-stories/)
	
	As a User I should be able to see a list of psychologist
	As a User I should be able to select a psychologist
	As a User I should be able to have a conversation with the psychologist I have chosen.

Let's start building
-----

1. Create a folder "psychologist" under /var/www/html, to hold our "psychologist" app
2. Create a index.html file with some initial html
    ```html
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <title>Psychologist</title>
        </head>
        <body>
            <h1>Hello, You need help and I can help you</h1>
        </body>
    </html>
    ```
        
3. Make sure you can access the file
    * Browse to localhost/psychologist
    * If apache finds an index.html file in a directory - it serves it
    
4. Let's build User Story 1
    As a User I should be able to see a list of psychologist
    
    * Under the `<h1>` in index.html, add a section to hold the list of available psychologists:
        ```html
        <section>
          <h2>Here is a list of available psychologist</h2>
          <div id="psychologist-list">
          </div>
        </section>
        ```
    * Test to make sure the new section renders:
        http://localhost/psychologist

    * Get the List of psychlogists from the server:
        * Simulate a backend call:
        * Simulated Data (JSON List of Psychologists):
        ```json
        [
          {
            "id": 1,
            "name": "Sigmund Freud",
            "years_of_experience": 160,
            "rate": "160 Euro/hr" 
          },
          {
            "id": 2,
            "name": "Dr. Phil",
            "years_of_experience": 20,
            "rate": "$3.25/hr" 
          },
          {
            "id": 3,
            "name": "Cookie Monster",
            "years_of_experience": 50,
            "rate": "7 cookies/hour"
          },
          {
            "id": 4,
            "name": "Borat",
            "years_of_experience": 10,
            "rate": "1 goat/hour"
          }
        ]
        ```
        * Save the data in list.json file in the psychologist folder
        * Test the simulated server call: http://localhost/psychologist/list.json
        * Cool, now we have a back-end API which gives us the data for the list of all psychologist
    
    * Q: How do we get the data to display? - A: Javascript and Ajax.
        * Make a back-end call to '/psychologist/list.json' (from the fron-end mark-up - index.html)
            * Include the following javascript right before </body> in index.html
            ```javascript
            <script>
              (function(){
                  console.log("Hey there, I will be calling the server to get a list of psychos here.")
              })();
            </script>
            ```
            * Save the file
            * Browse to http://localhost/psychologist
            * Inside the browser, hit F12, make sure you see the console.log line displayed
            * Cool, we saw stuff print in the console. Now, Let's make an actual server call.
            * Change the script to make an AJAX call to the server, to get the list of all psychologists:
            ```javascript
            <script>
                (function() {
                    console.log("Hey there, I will be calling the server to get a list of psychos here.");
                    var httpRequest = new XMLHttpRequest();
                    
                    httpRequest.onreadystatechange = function() {
        
                        if (httpRequest.readyState == 4 && httpRequest.status === 200) {
                            console.log('psychologists from the server: ' + httpRequest.responseText);
                        } else if (httpRequest.readyState !== 4 && httpRequest.status !== 200)  {
                            alert("Something went terribly BAD. It is most likely YOUR fault! To be on the safe side, you should resign immediately.");
                        }
                    };
        
                    httpRequest.open('GET', '/psychologist/list.json');
                    httpRequest.send();
                })();
            </script>
            ```      
            * Save the file, refresh http://localhost/psychologist, make sure the list of psychologists shows up in the console
            
        * Now, let's display the list of psychologists on the page
            Change this line:
            
                console.log('psychologists from the server: ' + httpRequest.responseText);
            To this:
            
                document.querySelector('div#psychologist-list').innerHTML = httpRequest.responseText;
            
            The previous line finds the ```<div>``` with an "id" of "psychologist-list" and sets its content to the response we got from the server(the list of psychologists)
        
            * Let's see if it works - F5. All right! Nice, but not very usable.
            * Let's mock up something a bit prettier
            ```html
            <div id="psychologist-mock-up">
                <ul>
                  <li>Name: Sigmund Freud</li>
                  <li>Experience: 7 years</li>
                  <li>Rate: $150</li>
                </ul>
            
                <ul>
                  <li>Name: Dr. Phil</li>
                  <li>Experience: 77 years</li>
                  <li>Rate: $57</li>
                </ul>
            
                <ul>
                  <li>Name: Cookie Monster</li>
                  <li>Experience: 887 years</li>
                  <li>Rate: $987</li>
                </ul>
            
                <ul>
                  <li>Name: Borat</li>
                  <li>Experience: 951 years</li>
                  <li>Rate: $777</li>
                </ul>
        
            </div>
            ```
            * Place the html snippet right above the ```<div id="psychologist-list">```
            * F5 at the browser to test it - Better, but not great. We care about functionality for now. We will make it even prettier later.
            * Now, let's replace the static data with the dynamic data we got from the server:
                Notice how the ```<ul>``` part repeats?
                The data changes, but the structure stays the same. Perfect for a template, right?
                
                * Create a single psychologist template
                * For every psychologist - populate the template with the specific data
                * Concat all the populated templates
                * Set the content of ```<div id=""></div>``` to the String resulting from the concat of the individual populated templates
            
            * Create a single psychologist template and place it right before the ```<script>```
            ```html
            <template id="psychologist-template">
                <ul>
        
                    <li>
                        <label>Name:</label>
                        <span class="psycho-name"></span>
                    </li>
        
                    <li>
                        <label>Experience:</label>
                        <span class="psycho-experience"></span>
                    </li>
        
                    <li>
                        <label>Rate:</label>
                        <span class="psycho-rate"></span>
                    </li>
        
                </ul>
            </template>
            ```
            * For every psychologist - populate the template with the specific data
                * Add this right after ```console.log('psychologists from the server: ' + httpRequest.responseText);```
                ```javascript
                var psychologists = JSON.parse(httpRequest.responseText);
                console.log("psychologists: " + psychologists);

                var psychologist_div_content = '';

                psychologists.forEach(function(psychologist) {

                    var psychologist_template = document.querySelector('#psychologist-template');
                    psychologist_template.content.querySelector('.psycho-name').textContent = psychologist.name;
                    psychologist_template.content.querySelector('.psycho-experience').textContent = psychologist.years_of_experience;
                    psychologist_template.content.querySelector('.psycho-rate').textContent = psychologist.rate;
                    psychologist_div_content += psychologist_template.innerHTML;
                });

                document.querySelector('#psychologist-list').innerHTML = psychologist_div_content;
                ```
                * Line by line explanation:
                
                    ```var psychologists = JSON.parse(httpRequest.responseText);```<br/>
                    Takes the string response from '/psychologist/list.json' and parses it into a javascript object
                    
                    ```var psychologist_template = document.querySelector('#psychologist-template');```<br/>
                    Locates and retrieves the single psychologist template
                    
                    ```psychologist_template.content.querySelector('.psycho-name').textContent = psychologist.name;```<br/>
                    Locates and retrieves ```<span class="psycho-name"></span>``` ; Sets the content of it to the name from the psychologist json ```{ "name": "Sigmund Freud"}```
                    
                    ```psychologist_div_content += psychologist_template.innerHTML;```<br/>
                    Concats the specific psychologist's populated template to the accumulated mark-up
                    
                    ```document.querySelector('#psychologist-list').innerHTML = psychologist_div_content;```<br/>
                    Locates and retrieves the ```<div>``` with "id" of "psychologist-list".;
                    Sets the content of the ```<div>``` to the accumulated psychologists mark-up
                    
            * Remove the mocked up div ```<div id="psychologist-mock-up">```
            * Save the file and F5 at the browser to test
            * Cool, so this is what we did
                * We created a template for a psychologist
                * We got a list of psychologist from the server with Ajax
                * We used javascript to populate the template and accumulate the templates into one string
                * We used javascript to set the content of a ```<div>``` to the accumulated string
                ```javascript
                <template id="psychologist-template">
                    <ul>
        
                        <li>
                            <label>Name:</label>
                            <span class="psycho-name"></span>
                        </li>
        
                        <li>
                            <label>Experience:</label>
                            <span class="psycho-experience"></span>
                        </li>
        
                        <li>
                            <label>Rate:</label>
                            <span class="psycho-rate"></span>
                        </li>
        
                    </ul>
                </template>
        
                <script>
                    (function(){
                        console.log("Hey there, I will be calling the server to get a list of psychos here.");
                        var httpRequest = new XMLHttpRequest();
                        httpRequest.onreadystatechange = function() {
                            if (httpRequest.readyState === 4 && httpRequest.status === 200) {
        
                                //convert the string received from the server to a js object
                                var psychologists = JSON.parse(httpRequest.responseText);
        
                                var psychologist_div_content = '';
        
                                //for every psychologist record populate the data into the template
                                //then append the populated template at the end of the <div id="psychologist-list"> content
                                psychologists.forEach(function(psychologist) {
        
                                    var psychologist_template = document.querySelector('#psychologist-template');
                                    psychologist_template.content.querySelector('.psycho-name').textContent = psychologist.name;
                                    psychologist_template.content.querySelector('.psycho-experience').textContent = psychologist.years_of_experience;
                                    psychologist_template.content.querySelector('.psycho-rate').textContent = psychologist.rate;
                                    psychologist_div_content += psychologist_template.innerHTML;
                                });
        
                                document.querySelector('#psychologist-list').innerHTML = psychologist_div_content;
        
                            } else if (httpRequest.readyState === 4 && httpRequest.status !== 200)  {
                                document.querySelector('div#psychologist-list').innerHTML = "You Messed UP!!!";
                            }
                        };
        
                        httpRequest.open('GET', '/psychologist/list.json');
                        httpRequest.send();
                    })();
                </script>
                ```
4. Let's build User Story 2
                
    As a User I should be able to select a psychologist
    
    * Since we can have a session with one psychologist, let's make the selection of a psychologist a radio button
        * Change the template to
            ```html
            <template id="psychologist-template">
                <input type="radio" class="psycho-name" name="psycho-name" value=""/>
                <span class="psycho-name"></span>
                <ul>
                    <li>
                        <label>Experience:</label>
                        <span class="psycho-experience"></span>
                    </li>
                    <li>
                        <label>Rate:</label>
                        <span class="psycho-rate"></span>
                    </li>
                </ul>
            </template>
            ```
         * Javascript change to work with new structure
            ```javascript
            psychologist_template.content.querySelector('.psycho-name').textContent = psychologist.name;
            ```
            To:
            ```javascript
            psychologist_template.content.querySelector('input.psycho-name').value = psychologist.id;
            psychologist_template.content.querySelector('span.psycho-name').textContent = psychologist.name;
            ```
    * Now, let's turn the list of psychologists into a form and send our preference to the server
      * wrap the ```<div id="pshychologists-list">``` within a ```<form>```
      ```html
      <form>
          <div id="psychologist-list">
          </div>
      </form>
      ```
      * POST the selection to the server
          * handle radio button selection event
          ```javascript
          document.querySelector('form.psycho-name')
          ```
