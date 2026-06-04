const nazkExtStyles = document.createElement("style");
nazkExtStyles.id = 'hoverCardbodyStyle_id';
nazkExtStyles.innerText = `
.card-header:hover {
    background-color: #eee; cursor: pointer;
}
.real-estate-results {
    margin-bottom: 15px;
    padding: 5px 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
}
.real-estate-item {
    padding: 2px 0;
}
.year-badge {
    position: fixed;
    z-index: 300;
    top: 0px;
    left: 50px;
    padding: 0px 12px;
    border: 1px solid rgb(187, 187, 187);
    border-radius: 0px 0px 4px 4px;
    font-size: 16px;
    font-weight: bold;
    background-color: coral;
    color: whitesmoke;
}
.nav-item {
  position: relative;
  color: white;
  cursor: pointer;
}
.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  list-style: none;
  padding: 10px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  
  display: none; 
  min-width: 200px;
}
.nav-item:hover .dropdown {
  display: block;
}
.dropdown div a {
  color: #333;
  text-decoration: none;
  display: block;
  padding: 5px 0;
}
`;
(document.head || document.documentElement).appendChild(nazkExtStyles);
