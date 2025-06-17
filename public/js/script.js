(() => {
  'use strict'; // Enforce stricter parsing and error handling

  // Select all forms that need Bootstrap validation
  const forms = document.querySelectorAll('.needs-validation');

  // Loop through each form and add submit event listener
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      // If form is invalid, prevent submission
      if (!form.checkValidity()) {
        event.preventDefault();      // Stop form from submitting
        event.stopPropagation();     // Stop the event from bubbling up
      }

      // Add Bootstrap validation styling 
      form.classList.add('was-validated');
    }, false);
  });
})();
