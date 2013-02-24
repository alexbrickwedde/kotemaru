package org.kotemaru.blog.converter;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class Tool {
	public static String getMonth(Blog blog) {
		return zeroSuf(blog.getDate().getMonth()+1, 2);
	}
	
	public static String yyyymmdd(Date date) {
		SimpleDateFormat fmt = new SimpleDateFormat("yyyy/MM/dd");
		return fmt.format(date);
	}

	public static String zeroSuf(int val, int len) {
		String str = "000000000000000000000000"+val;
		return str.substring(str.length()-len);
	}
	
	public static String encode(String str) {
		try {
			return URLEncoder.encode(str, "MS932")
					.replaceFirst("^%", "_").replaceAll("%","");
		} catch (UnsupportedEncodingException e) {
			throw new Error(e);
		}
	}
	
	public static String escape(String str) {
		return str.replaceAll("&", "&amp;")
				.replaceAll("<","&lt;")
				.replaceAll(">","&gt;");
	}
	public static String rfc822(Date date) {
		SimpleDateFormat rfc822
			= new SimpleDateFormat("EEE', 'dd' 'MMM' 'yyyy' 'HH:mm:ss' 'Z", Locale.US);
		return rfc822.format(date);
	}

}