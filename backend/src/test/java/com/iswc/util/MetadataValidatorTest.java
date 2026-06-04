package com.iswc.util;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class MetadataValidatorTest {

    @Test
    void testValidateIswc() {
        // Valid ISWC cases
        assertTrue(MetadataValidator.validateIswc("T-034.524.680-1"));
        assertTrue(MetadataValidator.validateIswc("T0345246801"));
        assertTrue(MetadataValidator.validateIswc("T-034524680-1"));
        assertTrue(MetadataValidator.validateIswc("t-034524680-1")); // case insensitive

        // Invalid ISWC cases
        assertFalse(MetadataValidator.validateIswc(null));
        assertFalse(MetadataValidator.validateIswc(""));
        assertFalse(MetadataValidator.validateIswc("T-034.524.680-2")); // wrong check digit
        assertFalse(MetadataValidator.validateIswc("A-034.524.680-1")); // doesn't start with T
        assertFalse(MetadataValidator.validateIswc("T-034.524.68-1"));   // too short
        assertFalse(MetadataValidator.validateIswc("T-034.524.6800-1")); // too long
        assertFalse(MetadataValidator.validateIswc("T-034.XYZ.680-1"));  // non-numeric digits
    }

    @Test
    void testValidateIsni() {
        // Valid ISNI cases
        assertTrue(MetadataValidator.validateIsni("000000012150090X"));
        assertTrue(MetadataValidator.validateIsni("0000-0001-2150-090X"));
        assertTrue(MetadataValidator.validateIsni("0000 0001 2150 090X"));
        assertTrue(MetadataValidator.validateIsni("000000012150090x")); // case insensitive

        // Invalid ISNI cases
        assertFalse(MetadataValidator.validateIsni(null));
        assertFalse(MetadataValidator.validateIsni(""));
        assertFalse(MetadataValidator.validateIsni("0000000121500901")); // wrong check digit
        assertFalse(MetadataValidator.validateIsni("000000012150090"));  // too short
        assertFalse(MetadataValidator.validateIsni("000000012150090XX")); // too long
        assertFalse(MetadataValidator.validateIsni("000000012150090A"));  // invalid character
    }
}
