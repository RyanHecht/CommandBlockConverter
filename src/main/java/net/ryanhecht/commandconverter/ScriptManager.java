package net.ryanhecht.commandconverter;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;

import org.apache.commons.lang.StringEscapeUtils;

public class ScriptManager {
  ScriptEngine engine;
  public ScriptManager() throws ScriptException, IOException {
    engine = new ScriptEngineManager().getEngineByName("nashorn");
    try (InputStream in = this.getClass().getResourceAsStream("/js.js");

        BufferedReader reader = new BufferedReader(new InputStreamReader(in))) {
      engine.eval(reader, engine.getContext());
    }
  }

  public ScriptManager(String script) throws ScriptException {
    engine = new ScriptEngineManager().getEngineByName("nashorn");

    engine.eval(script, engine.getContext());

  }

  public String convertCommand(String command) throws ScriptException {
    command = "completelyConvert(\"" + StringEscapeUtils.escapeJavaScript(command) + "\")";

    Object returned = engine.eval(command, engine.getContext());
    if (returned instanceof String) {
      return (String) returned;
    } else {
      throw new IllegalArgumentException("Input did not return String");
    }
  }
}
