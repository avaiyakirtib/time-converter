let select = document.getElementById("select");
async function getSearch() {
  let search = document.getElementById("search").value;
  let listInnerHTML = `<select id='list'>`;
  listInnerHTML += "<option selected value=''> Select the city</option>";
  const response = await fetch(
    `https://time-converter-lo53.onrender.com/search/?search=${search}`
  );
  const data = await response.json();
  // data.forEach(e => {
  // });
  for (let e of data) {
    listInnerHTML += `<option value="${e.Offset} && ${e.Name}">${e.Name}</option>`;
  }
  listInnerHTML += `</option>`;
  select.innerHTML = listInnerHTML;
  let list = document.getElementById("list");
  list.addEventListener("click", () => {
    let cityName = list.value.split(" && ")[1];
    let cityOffset = list.value.split(" && ")[0];
    if (!cityName) return;

    var originalDateTime = new Date().toUTCString();
    var originalOffset = 0;
    var targetOffset = Number(cityOffset) * 60;

    var originalMoment = moment.utc(originalDateTime).utcOffset(originalOffset);

    var targetMoment = originalMoment.clone().utcOffset(targetOffset);
    var mainDiv = document.getElementById("mainDiv");
    let cityHTML = "";
    cityHTML += mainDiv.innerHTML;

    cityHTML += `<div class="box">
            <div style="display: flex;">
              <div class="cityname">
                <h1 style="margin: 0">${cityName}</h1>
              </div>
              <div class="time-date">
                <input type="text" value='${targetMoment.format(
                  "HH:mm"
                )}' onchange='getValue(this.value, this.getAttribute("offset"), this.getAttribute("time"))' style="width: 60px; height: 25px; border-radius: 8px; outline-style: none; border: none; text-align: center;" time='${targetMoment.format()}' offset='${cityOffset}' id='inputTime'/>
                <h3 style="display: flex; align-items: center; margin: 0; padding:0 10px;">
                  ${targetMoment.format("DD-MM-YYYY")}
                </h3>
              </div>
            </div>
          </div>`;

    mainDiv.innerHTML = cityHTML;
    document.getElementById("search").value = "";
    select.innerHTML = "";
  });
}

async function getValue(getTime, offset, time) {
  const convertTime = time.replace(/T\d{2}:\d{2}/, "T" + getTime);
  if (moment(convertTime).format() == "Invalid date") {
    console.log(getTime, "invalid date");
    return;
  }
  const gmtTime = moment(convertTime).utc().format();

  let inputTimeAll = document.querySelectorAll("#inputTime");
  inputTimeAll.forEach((e) => {
    let inputOffset = e.getAttribute("offset");
    var originalDateTime = gmtTime;
    var originalOffset = 0;
    var targetOffset = Number(inputOffset) * 60;

    var originalMoment = moment.utc(originalDateTime).utcOffset(originalOffset);

    var targetMoment = originalMoment.clone().utcOffset(targetOffset);
    e.value = targetMoment.format("HH:mm");
    // e.setAttribute("value", targetMoment.format("HH:mm"));
    const parentElement = e.parentNode || e.parentElement;
    parentElement.querySelector("h3").innerText =
      targetMoment.format("DD-MM-YYYY");
  });
}
