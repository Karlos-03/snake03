<?php
if (isset($_GET['score'])) {
    $score = (int)$_GET['score'];
    
    // Leer puntuaciones existentes
    $scores = file_exists('scores.txt') ? 
        file('scores.txt', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) : [];
    
    // Añadir nueva puntuación
    $scores[] = $score;
    
    // Ordenar de mayor a menor
    rsort($scores, SORT_NUMERIC);
    
    // Mantener solo las 10 mejores
    $scores = array_slice($scores, 0, 10);
    
    // Guardar en el archivo
    file_put_contents('scores.txt', implode("\n", $scores));
    
    echo json_encode([
        'success' => true,
        'scores' => $scores
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'No score provided'
    ]);
}
?>