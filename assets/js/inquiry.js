

jQuery(function($) {

    const form = document.querySelector('form[name="inquiry_form"]');
    initFormPhone(form);


    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = form.querySelector('input[name="name"]').value;
        const phone = form.querySelector('input[name="phone"]').value;
        const email = form.querySelector('input[name="email"]').value;

        const company = form.querySelector('input[name="company"]').value;
        const position = form.querySelector('input[name="position"]').value;
        const message = form.querySelector('textarea[name="message"]').value;
        const agree1 = (form.querySelector('input[name="agree1"]:checked')) ? true: false;


        if (name.split(' ').join('') === '') {
            alert('Enter your name.');
            form.querySelector('input[name="name"]').focus();
            return false;
        }
        if (phone.split(' ').join('') === '') {
            alert('Enter your phone.');
            form.querySelector('input[name="phone"]').focus();
            return false;
        }
        if (phone.split(' ').join('') === '') {
            alert('Enter your phone.');
            form.querySelector('input[name="phone"]').focus();
            return false;
        }
        if ( checkEmailValid(email) === false) {
            alert('Enter your valid email.');
            form.querySelector('input[name="email"]').focus();
            return false;
        }
        if (company.split(' ').join('') === '') {
            alert('Enter your company.');
            form.querySelector('input[name="company"]').focus();
            return false;
        }
        if (position.split(' ').join('') === '') {
            alert('Enter your position.');
            form.querySelector('input[name="position"]').focus();
            return false;
        }
        if (message.split(' ').join('') === '') {
            alert('Enter your message.');
            form.querySelector('textarea[name="message"]').focus();
            return false;
        }

        if (agree1 === false) {
            alert('Agree with `Consents to collection and use of personal information`');
            return false;
        }
        form.querySelectorAll('button').forEach(btn => {
            btn.setAttribute('disabled', 'disabled');
        })

        const data = new FormData(form);
        const request = new XMLHttpRequest();

        // console.log('form.method, form.action', form.getAttribute('method'), form.getAttribute('action'));
        request.onreadystatechange = function(e) {
            if (request.readyState == 4) {
                // document.querySelector('#inquiryPop').remove();
                form.querySelectorAll('button').forEach(btn => {
                    btn.removeAttribute('disabled');
                    form.reset();
                })
                alert('Thank you!');

            }
        }

        request.open(form.getAttribute('method'), form.getAttribute('action'));
        request.send(data);

    });



});

function initFormPhone(form) {
    // form.querySelectorAll('input[type="tel"]').forEach((el) => {
    //     el.maxLength = 13;
    //     el.addEventListener('keyup', function() {
    //         const val = el.value;
    //         el.value = val.replace(/[^0-9]/g, "").replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/,"$1-$2-$3").replace("--", "-");
    //     });
    // })
}

function checkEmailValid(email) {
    const regex = /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@[*[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+]*/;
    return regex.test(email);
}