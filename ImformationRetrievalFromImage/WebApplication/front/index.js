const imageInput = document.querySelector("#file-ip-1");

const btnInput = document.querySelector("#file-ip-2");

//change table on view text
btnInput.addEventListener('click', async event => {
  const { data } = await fetch('/getAll')
    .then(response => response.json())
    .then(data => data);

  console.log(data);

  const x = document.querySelector("#table");

  setEditView(data);

  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }

  loadHTMLTable(data);

});

document.addEventListener('DOMContentLoaded', function () {

  const x = document.querySelector("#table");

  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
});

document.querySelector('table tbody').addEventListener('click', function (event) {
  if (event.target.id === "delBtn") {
    deleteRowById(event.target.dataset.id);
  }
  if (event.target.id === "editBtn") {
    handleEditRow(event.target.dataset.id);
  }
});

imageInput.addEventListener('change', async event => {
  if (event.target.files.length > 0) {
    event.preventDefault()
    const file = imageInput.files[0]

    // get secure url from our server
    const  { url }  = await fetch("/s3Url").then(res => res.json())
    console.log(url)

    // post the image direclty to the s3 bucket
    await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "multipart/form-data"
      },
      body: file
    })

    const imageUrl = url.split('?')[0]
    console.log(imageUrl)
    var preview = document.getElementById("file-ip-1-preview");
    preview.src = imageUrl;
    preview.style.display = "block";
  }
})

function loadHTMLTable(data) {
  const table = document.querySelector('table tbody');

  if (data.length === 0) {
    table.innerHTML = "<tr><td class='no-data' colspan='3'>No Data</td></tr>";
    return;
  }

  let tableHtml = "";

  data.forEach(function ({ id, firstname, lastname, dob, id_type, document_number, expdt, state_name }) {
    tableHtml += "<tr>";
    tableHtml += `<td>${id}</td>`;
    tableHtml += `<td>${firstname}</td>`;
    tableHtml += `<td>${lastname}</td>`;
    // tableHtml += `<td><input type="text" class="form-input input text" id="update-name-input" value=${lastname}></td>`;
    tableHtml += `<td>${dob}</td>`;
    tableHtml += `<td>${id_type}</td>`;
    tableHtml += `<td>${document_number}</td>`;
    tableHtml += `<td>${expdt}</td>`;
    tableHtml += `<td>${state_name}</td>`;
    tableHtml += `<td><button id="delBtn" class="btn btn-success" data-id=${id}>Delete</td>`;
    tableHtml += `<td><button id="editBtn" class="btn btn-success" data-toggle="modal" data-target="#exampleModal-4" data-whatever="@fat" data-id=${id}>Edit</td>`;
    tableHtml += "</tr>";
  });

  table.innerHTML = tableHtml;
}

function setEditView(data) {

  if (data.length === 0) {
    table.innerHTML = "<tr><td class='no-data' colspan='3'>No Data</td></tr>";
    return;
  }


  data.forEach(function ({ id, firstname, lastname, dob, id_type, document_number, expdt, state_name }) {

    document.querySelector("#fname").value = `${firstname}`;
    document.querySelector("#lname").value = `${lastname}`;
    document.querySelector("#DOB").value = `${dob}`;
    document.querySelector("#idType").value = `${id_type}`;
    document.querySelector("#docNum").value = `${document_number}`;
    document.querySelector("#expDate").value = `${expdt}`;
    //document.querySelector("#classType").value = `${firstname}`;
    document.querySelector("#state").value = `${state_name}`;

  });
}

function handleEditRow(id) {
  document.querySelector('#updateBtn').dataset.id = id;
}

function deleteRowById(id) {
  fetch('delete/' + id, {
    method: 'DELETE'
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        location.reload();
      }
    });
}

// updateBtn.onclick = function () {
//   const updateNameInput = document.querySelector('#update-name-input');


//   console.log(updateNameInput);
//   const url = "/update";

//   fetch(url, {
//     method: 'PATCH',
//     headers: {
//       'Content-type': 'application/json'
//     },
//     body: JSON.stringify({
//       id: updateNameInput.dataset.id,
//       name: updateNameInput.value
//     })
//   })
//     .then(response => response.json())
//     .then(data => {
//       if (data.success) {
//         location.reload();
//       }
//     })
// }

document.querySelector('#updateBtn').addEventListener('click', function (event) {

  const updateNameInput = document.querySelector('#updateBtn');

  const fname = document.querySelector("#fname").value;
  const lname = document.querySelector("#lname").value;
  const dob = document.querySelector("#DOB").value;
  const idType = document.querySelector("#idType").value;
  const docNum = document.querySelector("#docNum").value;
  const expDate = document.querySelector("#expDate").value;
  const state = document.querySelector("#state").value;


  fetch("/update", {
    method: 'PATCH',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      id: updateNameInput.dataset.id,
      fname: fname,
      lname: lname,
      dob: dob,
      idType: idType,
      docNum: docNum,
      expDate:expDate,
      state: state
    })
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        location.reload();
      }
    })
});
