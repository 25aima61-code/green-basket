function placeOrder() {

  fetch("/add-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      className: document.getElementById("class").value,
      item: document.getElementById("item").value
    })
  })
  .then(res => res.text())
  .then(data => {
    alert(data);
  });

}