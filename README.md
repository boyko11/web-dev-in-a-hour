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

###Stories in Gherkin Syntax
	
	As a User I should be able to see a list of psychologist
	As a User I should be able to select a psychologist
	As a User I should be able to have a conversation with the psychologist I have chosen.

###Let's jump in. 

	Story 1: As a User I should be able to see a list of psychologist

    We will call our app "psychologist".
    Let's create it and make sure we can access it.
    HTML template file:

    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Title</title>
    </head>
    <body>

    </body>
    </html>

###Let's customize the template and see if we can get it to work:

    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Psychologist</title>
    </head>
    <body>
      <h1>Hello There, I am your friendly psychologist assistant.</h1>
    </body>
    </html>

    Create a folder "psychologist" under /var/www/html
    Create file index.html and copy over the above html.
    http://vccbt-lt1-vm1/dev/psychologist

    Allocate a space on the page for the list of available psychologists:

        <section>
          <h2>Here is a list of available psychologist</h2>
          <div id="psychologist-list">
          </div>
        </section>

    Let's test it.
    http://vccbt-lt1-vm1/dev/psychologist

    Get the List of psychlogists from the server:
    Simulate a backend call:

	  Simulated Data (JSON List of Psychologists):

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
        "name": "Cookiemonster",
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

    Create a list.json file in the psychologist folder
    Make sure we can get it:

    http://vccbt-lt1-vm1/dev/psychologist/list.json

    Cool, now we have a back end API, that gives us a list of psychologists

    Now, how do we get them to display?
    Answer: Javascript and Ajax.

    Let's add this right before </body> in index.html file
        <script>
          (function(){
              console.log("Hey there, I will be calling the server to get a list of psychos here.")
          })();
        </script>

    Let's test it:
    Cool, we saw stuff printe in the console.
    Let's make an actual server call:

    <script>
        (function() {
            console.log("Hey there, I will be calling the server to get a list of psychos here.");
            var httpRequest = new XMLHttpRequest();
            httpRequest.onreadystatechange = function() {

                if (httpRequest.readyState == 4 && httpRequest.status === 200) {
                    document.querySelector('div#psychologist-list').innerHTML = httpRequest.responseText;
                } else if (httpRequest.readyState !== 4 && httpRequest.status !== 200)  {
                    document.querySelector('div#psychologist-list').innerHTML = "You Messed UP!!!";
                }
            };

            httpRequest.open('GET', '/psychologist/list.json');
            httpRequest.send();
        })();
    </script>

    Let's see if it works - F5.
    All right! Nice, but not very usable, let's just make it a bit pretty:

    Let's remove the div that splatters the json and 
    Let's mock up what I would like to see instead:

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

    Let's put this <div>, right before the "psychologist-list" div.
    Test it - OK, not great, but better. We will get back to it to make it prettier. For now, we are hung on functionality

    Now, let's replace the static data with the dynamic data we got from the server:

    Notice how the <ul> part repeats?
    The data changes, but the structure stays the same. Perfect for a template, right?
    Get the template, fill it out with the specific data, then render the populated template.

    How do we do that?

    Well' let's create a template!

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
    </script>

    We have to place it before our "Get Data Ajax" script, since it would be dependent on the template being present.
    Now we have to change the javascript to populate the template with the data from the server.


        <script>
            (function(){
                console.log("Hey there, I will be calling the server to get a list of psychos here.");
                var httpRequest = new XMLHttpRequest();
                httpRequest.onreadystatechange = function() {
                    if (httpRequest.readyState === 4 && httpRequest.status === 200) {
                        
                        
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

                    } else if (httpRequest.readyState === 4 && httpRequest.status !== 200)  {
                        document.querySelector('div#psychologist-list').innerHTML = "You Messed UP!!!";
                    }
                };

                httpRequest.open('GET', '/psychologist/list.json');
                httpRequest.send();
            })();
        </script>




