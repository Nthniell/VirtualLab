document.getElementById('menu-placeholder').innerHTML = `
    <ul class="nav-menu">
        <li><a href="home.html">Home</a></li>
        <li><a href="tutorial.html">Tutorial</a></li>
        <li><a href="virtualLab.html">Virtual Lab</a></li>
        <li><a href="logout.html" onclick="logout">Logout</a></li>
    </ul>
`;

async function logout() {
    try {
        await firebase.auth().signOut();
        window.location.href = 'logout.html';
    } catch (error) {
        console.error('Error logging out:', error);
    }
}

window.logout = logout;