$(document).ready(function() {
  // Adding event listener to "scrape new article" button
  $(document).on("click", ".scrape-new", function() {
    $.ajax({
      method: "GET",
      url: "/scrape"
    }).done(function(data) {
      console.log(data);
    });
  });

  // Grab the articles
  $.getJSON("/articles", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the corresponding information on the page
      $("#articles").append(
        "<p data-id='" +
          data[i]._id +
          "'>" +
          data[i].title +
          "<br />" +
          data[i].link +
          "</p>"
      );
    }
  });

  // Whenever someone clicks a p tag
  $(document).on("click", "p", function() {
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");

    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // With that done, add the note information to the page
      .then(function(data) {
        console.log(data);
        // The body of the article
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        // A button to submit a new note, with the id of the article saved to it
        $("#notes").append(
          "<button data-id='" + data._id + "' id='savenote'>Save Note</button>"
        );

        // If there's a note in the article
        if (data.note) {
          // Place the body of the note in the body textarea
          $("#bodyinput").val(data.note.body);
        }
      });
  });

  // When you click the savenote button
  $(document).on("click", "#savenote", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#notes").empty();
      });

    // Also, remove the values entered in the textarea for note entry
    $("#bodyinput").val("");
  });
});
