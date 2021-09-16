const form = $("#form");
// const form2 = $("#form2");
const inputfile = $("#inputfile");
const filelist = $("#filelist");
const download = $("#download");
// changed data into body in this get request
$.get("/filesinfolder").then((body) => {
  console.log(body);
  for (let i = 0; i < body.length; i++) {
    filelist.append(`<a href="/uploaded/${body[i]}">${body[i]}</a><br />`);
  }
});

form.on("submit", (e) => {
  e.preventDefault();

  var formData = new FormData();
  formData.append("data", $("#inputfile")[0].files[0]); // file-->data
  console.log(formData);

  $.ajax({
    url: "/",
    type: "POST",
    data: formData, // not file:formData
    processData: false,
    contentType: false,
    success: function (response) {
      console.log(response);
      filelist.append(`<a href="/uploaded/${response}">${response}</a><br />`);
    },
  });
  // $.post("/").then((data) => {
  //   console.log(data);
  //   for (let i = 0; i < data.length; i++) {
  //     filelist.append(`<a href="/uploaded/${data[i]}">${data[i]}</a><br />`);
  //   }
  // });
});
