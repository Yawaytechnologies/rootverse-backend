export function phone(checker_phone){
    // Temporarily accept any non-empty string for debugging
    return checker_phone && checker_phone.toString().trim().length > 0;
}
