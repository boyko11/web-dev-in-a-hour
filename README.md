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
    
    * Q: How do we get the data to display? - A: Javascript(jQuery) and Ajax.
        * What's jQuery? - it is a developer friendly abstraction of javascript. It is a javascript library.
        * Let's download the latest version: http://jquery.com/download/ and place it in the "pshychologist" folder
        * At the time of this download, the prod jQUery release is jquery-3.1.1.min.js
        * Let's include(import) it so we can
            * Right before `</head>`
            ```javascript
            <script src="jquery-3.1.1.min.js"></script>
            ```
        * Make a back-end call to '/psychologist/list.json' (from the front-end mark-up - index.html)
            * Include the following javascript right before </body> in index.html
            ```javascript
            <script>
              $(document).ready(function() {
                  
                  console.log("Hey there, I will be calling the server to get a list of psychos here.")
              });
            </script>
            ```
            * Save the file
            * Browse to http://localhost/psychologist
            * Inside the browser, hit F12, make sure you see the console.log line displayed
            * Cool, we saw stuff print in the console. Now, Let's make an actual server call.
            * Change the script to make an AJAX call to the server, to get the list of all psychologists:
            ```javascript
            <script>
                $(document).ready(function() {
    
                    console.log("Hey there, I will be calling the server to get a list of psychos here.");
                    $.ajax({
                        url: "/psychologist/list.json"
                    }).done( function( list_of_psychologists_from_server ) {
                    
                        $('div#psychologist-list').html( JSON.stringify(list_of_psychologists_from_server) );
                    }).fail( function() {
                    
                        alert('You messed up!');
                    });
                });
            </script>
            ```      
            * Save the file, refresh http://localhost/psychologist, make sure the list of psychologists shows up in the console
            
        * Now, let's display the list of psychologists on the page
            Change this line:
            
                console.log('list of psychologists: ' + data);
            To this:
            
                $('div#psychologist-list').html( JSON.stringify(data) );
            
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
                <div>
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
                </div>
            </template>
            ```
            * For every psychologist - populate the template with the specific data
                ```javascript
                    var psychologist_div_content = '';

                    list_of_psychologists_from_server.forEach( function( psychologist ) {

                        var psychologist_template = $($('template#psychologist-template').html());
                        psychologist_template.find('span.psycho-name').html( psychologist.name );
                        psychologist_template.find('span.psycho-experience').html( psychologist.years_of_experience );
                        psychologist_template.find('span.psycho-rate').html( psychologist.rate );
                        psychologist_div_content += psychologist_template.html();
                    });

                    $('div#psychologist-list').html( psychologist_div_content );
                ```
                * Line by line explanation:
                                   
                    ```var psychologist_template = $($('template#psychologist-template').html());```<br/>
                    Locates and retrieves the single psychologist template and creates(cookie cuts) a jQuery object off of it
                    
                    ```psychologist_template.find('span.psycho-name').html( psychologist.name );```<br/>
                    Locates and retrieves ```<span class="psycho-name"></span>``` ; Sets the content of it to the name from the psychologist json ```{ "name": "Sigmund Freud"}```
                    
                    ```psychologist_div_content += psychologist_template.html();```<br/>
                    Concats the specific psychologist's populated template to the accumulated mark-up
                    
                    ```$('div#psychologist-list').html( psychologist_div_content );```<br/>
                    Locates and retrieves the ```<div>``` with "id" of "psychologist-list".;
                    Sets the content of the ```<div>``` to the accumulated psychologists mark-up
                    
            * Remove the mocked up div ```<div id="psychologist-mock-up">```
            * Save the file and F5 at the browser to test
            * Cool, so this is what we did
                * We created a template for a psychologist
                * We got a list of psychologist from the server with Ajax(jQuery)
                * We used javascript(jQuery) to populate the template and accumulate the templates into one string
                * We used javascript(jQuery) to set the content of a ```<div>``` to the accumulated string
                ```javascript
                <template id="psychologist-template">
                    <div>
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
                    </div>
                </template>
                <script>
                    $(document).ready(function() {
        
                        console.log("Hey there, I will be calling the server to get a list of psychos here.");
                        $.ajax({
                            url: "/psychologist/list.json"
                        }).done( function( list_of_psychologists_from_server ) {
        
                            var psychologist_div_content = '';
        
                            list_of_psychologists_from_server.forEach( function( psychologist ) {
        
                                var psychologist_template = $($('template#psychologist-template').html());
                                psychologist_template.find('span.psycho-name').html( psychologist.name );
                                psychologist_template.find('span.psycho-experience').html( psychologist.years_of_experience );
                                psychologist_template.find('span.psycho-rate').html( psychologist.rate );
                                psychologist_div_content += psychologist_template.html();
                            });
        
                            $('div#psychologist-list').html( psychologist_div_content );
        
                        }).fail( function() {
        
                            alert('You messed up!');
                        });
                    });
                </script>
                ```
4. Let's build User Story 2
                
    As a User I should be able to select a psychologist
    
    * Since we can have a session with one psychologist, let's make the selection of a psychologist a radio button
        * Change the template to
            ```html
            <template id="psychologist-template">
                <div>
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
                </div>
            </template>
            ```
         * Javascript change to work with new structure
            ```javascript
            psychologist_template.find('span.psycho-name').html( psychologist.name );
            ```
            To:
            ```javascript
            psychologist_template.find('input.psycho-name').val(psychologist.id);
            psychologist_template.find('span.psycho-name').html(psychologist.name);
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
          * bind a radio-button change event - add anywhere in the $(document).ready block
          ```javascript
            $('html').on('change', 'input[type=radio][name=psycho-name]', function() {
               console.log('change event!');
            });
          ```
          * Let's POST the selection to the server
          ```javascript
          //bind radio-button
          $('html').on('change', 'input[type=radio][name=psycho-name]', function() {
              console.log('change event!');
              var post_data = {};
              post_data.id = $(this).val();
              $.ajax({
                  url: "/psychologist/preference-save.json",
                  type: "post",
                  data: post_data
              }).done( function( data ) {
                  console.log("Successful Post!");
              }).fail( function() {

                alert('You messed up!');
              });
          });
          ```
          * Let's test the post, F5 and select one of the radios - should get an error, since we don't have the emulated back end, so let's do that
          * Create a file "preference-save.json"
          ```javascript
          {
            "id": 1,
            "name": "Psychologist",
            "value": 1,
            "status": "active"
          }
          ```
          * Let's make sure we don't get an error this time - F5 and select a radio again
          * Now, let's do something with successfully returned saved preference
          * We will just display a successful message with the data returned from the server
          * Let's create a template and place right after(or right before) the existing template
          ```html
          <template id="saved-preference">
              <div>
                  <div>
                      <div>Congrats!</div>
                      <div>You have successfully saved your preference for a </div>
                      <div class="preference-name"></div>
                      <div> as </div>
                      <div class="preference-value"></div>
                  </div>
              </div>
          </template>
          ```
          * Now let's crank out the javascript to populate the template and display it
          * In the "done" callback for the POST, let's put this javascript
          ```javascript
          var preference_template = $($('template#saved-preference').html());
          preference_template.find('div.preference-name').html( saved_preference.name );
          preference_template.find('div.preference-value').html( saved_preference.value );
          console.log(preference_template.html());
          ```
          * Save it and test it(F5 and make sure the constructed mark-up displays in the console)
          * No let's make the mark-up display
          * Add an invisible container div, which we will populate with the dynamically generated mark-up and make visible
          * Add this html right after ```</form>```
          ```html
          <div id="saved-preference-container" style="display: none">
          </div>
          ```
          * Inject the dynamic mark-up into it
          ```javascript
          //console.log(preference_template.html());
          $('#saved-preference-container').html(preference_template.html());
          ```
          * Let's look at the DOM to see if it worked
          * Now Let's make the list of psychologists disappear and make the saved preference appear
          ```javascript
          $('#saved-preference-container').html(preference_template.html());
          $('#psychologist-list').hide();
          $('#saved-preference-container').show();
          ```
          * Not bad, but let's make it fancier - fade out the list and fade in the preference
          ```
          $('#psychologist-list').fadeOut(2500, function() {
            $('#saved-preference-container').fadeIn(2500);
          });
          ```