// Show customer form when Book Appointment button is clicked
document.getElementById('bookAppointmentBtn').addEventListener('click', function() {
    // Validate the appointment form
    var service = document.getElementById('service').value;
    var serviceType = document.getElementById('serviceType').value;
    var appointmentDate = document.getElementById('appointmentDate').value;
    var appointmentTime = document.getElementById('appointmentTime').value;

    if (service && serviceType && appointmentDate && appointmentTime) {
        // Store order details in local storage
        localStorage.setItem('orderDetails', JSON.stringify({
            service: service,
            serviceType: serviceType,
            appointmentDate: appointmentDate,
            appointmentTime: appointmentTime
        }));

        // Hide the appointment form and show the customer form
        document.getElementById('appointmentForm').style.display = 'none';
        document.getElementById('customerForm').style.display = 'block';
    } else {
        alert('Please fill out all fields.');
    }
});

// Handle customer form submission
document.getElementById('customerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    var name = document.getElementById('name').value;
    var phone = document.getElementById('phone').value;
    var address = document.getElementById('address').value;

    // Get order details from local storage
    var orderDetails = JSON.parse(localStorage.getItem('orderDetails'));

    if (name && phone && address && orderDetails) {
        // Save to Firestore
        db.collection('appointments').add({
            service: orderDetails.service,
            serviceType: orderDetails.serviceType,
            appointmentDate: orderDetails.appointmentDate,
            appointmentTime: orderDetails.appointmentTime,
            customerName: name,
            customerPhone: phone,
            customerAddress: address,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        }).then(function() {
            alert('Appointment booked successfully!');
            // Reset forms and local storage
            document.getElementById('appointmentForm').reset();
            document.getElementById('customerForm').reset();
            localStorage.removeItem('orderDetails');
            document.getElementById('appointmentForm').style.display = 'block';
            document.getElementById('customerForm').style.display = 'none';
        }).catch(function(error) {
            console.error('Error saving document: ', error);
        });
    } else {
        alert('Please fill out all fields.');
    }
});