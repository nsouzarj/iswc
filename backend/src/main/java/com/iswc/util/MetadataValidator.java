package com.iswc.util;

public final class MetadataValidator {

    private MetadataValidator() {
        // Prevent instantiation
    }

    /**
     * Validates an ISWC (International Standard Musical Work Code) using ISO 15707 MOD 10.
     * Format: T-NNNNNNNNN-C or TNNNNNNNNNC (T followed by 10 digits).
     *
     * @param iswc The ISWC code to validate.
     * @return true if valid, false otherwise.
     */
    public static boolean validateIswc(String iswc) {
        if (iswc == null) {
            return false;
        }

        // Strip hyphens, dots, and spaces
        String clean = iswc.replaceAll("[-.\\s]", "").toUpperCase();

        // Must be exactly 11 characters
        if (clean.length() != 11) {
            return false;
        }

        // Must start with 'T'
        if (clean.charAt(0) != 'T') {
            return false;
        }

        // Next 10 characters must be digits
        for (int i = 1; i < 11; i++) {
            if (!Character.isDigit(clean.charAt(i))) {
                return false;
            }
        }

        // Parse digits
        int[] d = new int[9];
        for (int i = 0; i < 9; i++) {
            d[i] = Character.getNumericValue(clean.charAt(i + 1));
        }

        int expectedCheckDigit = Character.getNumericValue(clean.charAt(10));

        // Calculate ISO 15707 MOD 10 checksum
        // S = 1 + sum(i * d_i) for i = 1 to 9
        int sum = 1;
        for (int i = 0; i < 9; i++) {
            sum += (i + 1) * d[i];
        }

        int calculatedCheckDigit = (10 - (sum % 10)) % 10;

        return calculatedCheckDigit == expectedCheckDigit;
    }

    /**
     * Validates an ISNI (International Standard Name Identifier) using ISO 7064 MOD 11-2.
     * Format: 16 digits, last character can be a digit or 'X'. Optionally hyphenated.
     *
     * @param isni The ISNI to validate.
     * @return true if valid, false otherwise.
     */
    public static boolean validateIsni(String isni) {
        if (isni == null) {
            return false;
        }

        // Strip hyphens and spaces
        String clean = isni.replaceAll("[-\\s]", "").toUpperCase();

        // Must be exactly 16 characters
        if (clean.length() != 16) {
            return false;
        }

        // First 15 must be digits
        for (int i = 0; i < 15; i++) {
            if (!Character.isDigit(clean.charAt(i))) {
                return false;
            }
        }

        // Last character must be a digit or 'X'
        char checkChar = clean.charAt(15);
        if (!Character.isDigit(checkChar) && checkChar != 'X') {
            return false;
        }

        // Calculate ISO 7064 MOD 11-2 checksum
        int p = 0;
        for (int i = 0; i < 15; i++) {
            int a = Character.getNumericValue(clean.charAt(i));
            int s = p + a;
            p = (s * 2) % 11;
        }

        int c = (12 - p) % 11;
        char expectedCheckChar = (c == 10) ? 'X' : Character.forDigit(c, 10);

        return expectedCheckChar == checkChar;
    }
}
