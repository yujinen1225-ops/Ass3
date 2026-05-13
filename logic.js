function openPolicy(policyId, btnElement) {
  var i;
  var x = document.getElementsByClassName("policy-section");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  document.getElementById(policyId).style.display = "block";

  var tabBtns = document.getElementsByClassName("tab-btn");
  for (i = 0; i < tabBtns.length; i++) {
    tabBtns[i].classList.remove("active");
  }
  btnElement.classList.add("active");
}