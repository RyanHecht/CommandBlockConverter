package commandconverter.test;

import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Paths;

import javax.script.ScriptException;

import org.junit.Test;

import junit.framework.TestCase;
import net.ryanhecht.commandconverter.ScriptManager;

public class ScriptTest extends TestCase {

  @Test
  public void test() {
    try {
      ScriptManager manager = new ScriptManager(readFile("js.js", Charset.defaultCharset()));
      String newCommand = manager.convertCommand("/summon ArmorStand ~ ~0.9 ~ {Equipment:[{},{id:\"leather_boots\",Count:1b,tag:{display:{color:15404044}}},{id:\"leather_leggings\",Count:1b,tag:{display:{color:16387140}}},{id:\"leather_chestplate\",Count:1b,tag:{display:{color:14880270}}},{}],NoGravity:1b,ShowArms:1b,Small:1b,Rotation:[21f],Pose:{Body:[64f,0f,0f],Head:[350f,14f,0f],LeftLeg:[179f,0f,0f],RightLeg:[179f,0f,0f],LeftArm:[241f,338f,0f],RightArm:[235f,14f,0f]}}");
      assert(newCommand.equals("/summon armor_stand ~ ~0.9 ~ {ArmorItems:[{id:\"leather_boots\",Count:1b,tag:{display:{color:15404044}}},{id:\"leather_leggings\",Count:1b,tag:{display:{color:16387140}}},{id:\"leather_chestplate\",Count:1b,tag:{display:{color:14880270}}},{}],NoGravity:1b,ShowArms:1b,Small:1b,Rotation:[21f],Pose:{Body:[64f,0f,0f],Head:[350f,14f,0f],LeftLeg:[179f,0f,0f],RightLeg:[179f,0f,0f],LeftArm:[241f,338f,0f],RightArm:[235f,14f,0f]}}"));
    } catch (ScriptException | IOException e) {
      // TODO Auto-generated catch block
      e.printStackTrace();
    }
  }

  static String readFile(String path, Charset encoding)
      throws IOException
  {
    byte[] encoded = Files.readAllBytes(Paths.get(path));
    return new String(encoded, encoding);
  }
}
