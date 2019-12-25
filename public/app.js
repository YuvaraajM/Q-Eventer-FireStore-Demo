const list = document.getElementById('displayUser');
var form1 = document.getElementById('adduser');
var btn = document.getElementById('btn');
var btn2 = document.getElementById('button');


//render the data from firestore in li:
function renderData(doc) {
    var li = document.createElement('li');
    var name = document.createElement('span');
    var cross = document.createElement('div');


    li.setAttribute('data-id', doc.id);
    name.textContent = doc.data().name;
    cross.textContent = 'x';

    li.appendChild(name);
    li.appendChild(cross);

    list.appendChild(li);

    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        var id = e.target.parentElement.getAttribute('data-id');
        db.collection('Users').doc(id).delete();
    })
}


//Accessing the Collection:
// db.collection('Users').get().then((snapshot) =>{
//     snapshot.docs.forEach(doc =>{
//         // console.log(doc.data());
//         renderData(doc);
//     });
// });

//Real-Time firestore fetching and updating the dom:
db.collection('Users').orderBy('name').onSnapshot(snapshot => {
    var changes = snapshot.docChanges();
    changes.forEach(change => {
        if (change.type == 'added') {
            renderData(change.doc);
        } else if (change.type == 'removed') {
            var li = list.querySelector('[data-id = ' + change.doc.id + ']');
            list.removeChild(li);
        }
    })
})

//saving data from the form :
btn.addEventListener('click', (e) => {
    e.preventDefault();
    console.log("btn submitted");
    //Assigning the values to FireStore:
    db.collection('Users').add({
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
    });
    //Making the input boxes clear after the button is clicked:
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';

});

//Search For Users:
btn2.addEventListener('click', (e) => {
    e.preventDefault();
    var user = document.getElementById('user').value;
    console.log(user);
    // window.alert('btn clicked');

    db.collection('Users').where('name', '==', user).get().then((result) => {
        // window.alert("User " + result.user + " is Found");
        result.docs.forEach(doc => {
            doc.name = user;
            // console.log(doc.name);
            if (user) {
                window.alert("User: " + doc.name + " is Found");
                console.log(doc);
            }
        });
        document.getElementById('user').value = '';
    });

})
