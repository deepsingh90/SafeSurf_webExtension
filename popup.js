// popup.js

document.addEventListener('DOMContentLoaded', function () {
    const popupContainer = document.getElementById('popupContainer');
    const popupOverlay = document.getElementById('popupOverlay');
    const popupClose = document.getElementById('popupClose');
    const feedbackButton = document.getElementById('feedbackButton');
    const contactSupportButton = document.getElementById('contactSupportButton');
    const viewBlockedSitesButton = document.getElementById('viewBlockedSitesButton');
    const feedbackForm = document.getElementById('feedbackForm');
    const submitFeedback = document.getElementById('submitFeedback');
  
    function showPopup() {
      popupContainer.style.display = 'block';
      popupOverlay.style.display = 'block';
    }
  
    function closePopup() {
      popupContainer.style.display = 'none';
      popupOverlay.style.display = 'none';
    }
  
    popupClose.addEventListener('click', closePopup);
    
    feedbackButton.addEventListener('click', function () {
      feedbackForm.style.display = 'block';
    });
  
    contactSupportButton.addEventListener('click', function () {
      window.location.href = 'mailto:deep94725kumar@gmail.com';
    });
  
    viewBlockedSitesButton.addEventListener('click', function () {
      // Logic to display blocked sites (e.g., open a new tab with a list of blocked sites)
      window.open('blocked_urls.json', '_blank');
    });
  
    submitFeedback.addEventListener('click', function () {
      const name = document.getElementById('name').value;
      const feedback = document.getElementById('feedback').value;
  
      if (name && feedback) {
        // Send feedback to server (replace with your server URL)
        fetch('http://localhost/save_feedback.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, feedback })
        })
        .then(response => response.json())
        .then(data => {
          alert('Feedback submitted successfully!');
          feedbackForm.style.display = 'none';
        })
        .catch(error => {
          console.error('Error:', error);
          alert('Failed to submit feedback.');
        });
      } else {
        alert('Please fill in all fields.');
      }
    });
  
    // Show popup for demonstration
    showPopup();
  });
  