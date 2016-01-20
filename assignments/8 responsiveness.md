@media (min-width: 400px) {
  <!-- when screen reaches width of 400px, apply rules below -->
    .media-container {    
        color: red;
    }

    .blue, .green {
        display: none;
    }
}

@media (min-width: 450px) {
  <!-- when screen reaches width of 450px, apply rules below -->
    .media-container {    
        color: blue;
    }

    .green, .red {
        display: none;
    }

    .blue {
        display: inline;
    }
}

@media (min-width: 500px) {
  <!-- when screen reaches width of 500px, apply rules below -->
    .media-container {    
        color: green;
    }

    .blue, .red {
        display: none;
    }

    .green {
        display: inline;
    }
}
