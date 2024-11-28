package com.vrv.VRV.Util;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Random;

public class UniqueIdGenerator {

  public static String generateUniqueId() {
      LocalDateTime now = LocalDateTime.now();
      DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
      String formattedDateTime = now.format(dateFormatter);
          
      Random random = new Random();
      int randomNumber = random.nextInt(1000) + 1;

      return formattedDateTime + String.format("%03d", randomNumber);
  }
}
