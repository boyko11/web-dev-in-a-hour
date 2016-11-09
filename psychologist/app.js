$(document).ready(function() {

    //bind radio-button
    $('html').on('change', 'input[type=radio][name=psycho-name]', function() {
        console.log('change event!');
        var post_data = {};
        post_data.id = $(this).val();
        $.ajax({
            url: "/psychologist/preference-save.json",
            type: "post",
            data: post_data
        }).done( function( saved_preference ) {
            console.log("Successful Post!");
            var preference_template = $($('template#saved-preference').html());
            preference_template.find('div.preference-name').html( saved_preference.name );
            preference_template.find('div.preference-value').html( saved_preference.value );
            //console.log(preference_template.html());
            $('#saved-preference-container').html(preference_template.html());
            $('#psychologist-list').fadeOut(2500, function() {
                $('#saved-preference-container').fadeIn(2500);
            });
        }).fail( function() {

            alert('You messed up!');
        });
    });

    console.log("Hey there, I will be calling the server to get a list of psychos here.");
    $.ajax({
        url: "/psychologist/list.json"
    }).done( function( list_of_psychologists_from_server ) {

        var psychologist_div_content = '';

        list_of_psychologists_from_server.forEach( function( psychologist ) {

            var psychologist_template = $($('template#psychologist-template').html());
            psychologist_template.find('span.psycho-name').html( psychologist.name );
            psychologist_template.find('input.psycho-name').val(psychologist.id);
            psychologist_template.find('span.psycho-name').html(psychologist.name);
            psychologist_template.find('span.psycho-experience').html( psychologist.years_of_experience );
            psychologist_template.find('span.psycho-rate').html( psychologist.rate );
            psychologist_div_content += psychologist_template.html();
        });

        $('div#psychologist-list').html( psychologist_div_content );

    }).fail( function() {

        alert('You messed up!');
    });
});