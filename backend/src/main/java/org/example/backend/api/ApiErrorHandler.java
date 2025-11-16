package org.example.backend.api;

import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Global API error handler for common REST concerns.
 *
 * <p>Currently handles:
 * <ul>
 *   <li>Bean Validation failures (@Valid) → 400 + per-field messages</li>
 * </ul>
 */
@RestControllerAdvice
public class ApiErrorHandler {

    /**
     * Handle validation errors from @Valid annotated request bodies.
     *
     * <p>Response shape:
     * <pre>
     * {
     *   "message": "Validation failed",
     *   "errors": {
     *     "fieldName": "Error message",
     *     ...
     *   }
     * }
     * </pre>
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
        // Top-level payload
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("message", "Validation failed");

        // Field → message map (preserves insertion order)
        Map<String, String> fieldErrors = new LinkedHashMap<>();
        ex.getBindingResult()
                .getFieldErrors()
                .forEach(err -> fieldErrors.put(err.getField(), err.getDefaultMessage()));

        body.put("errors", fieldErrors);

        return ResponseEntity.badRequest().body(body);
    }
}
