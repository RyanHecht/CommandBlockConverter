package net.ryanhecht.commandconverter;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.util.HashSet;

import javax.script.ScriptException;

import org.bukkit.Chunk;
import org.bukkit.block.BlockState;
import org.bukkit.block.CommandBlock;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.world.ChunkLoadEvent;

import com.bergerkiller.bukkit.common.utils.WorldUtil;

public class ChunkLoadListener implements Listener {
  private static HashSet<ChunkCoord> visitedChunks;

  public ChunkLoadListener() throws FileNotFoundException, IOException {
    Main.getPlugin(Main.class).getServer().getPluginManager().registerEvents(this, Main.getPlugin(Main.class));
    visitedChunks = loadCache();

  }

  @EventHandler
  public void onChunkLoad(ChunkLoadEvent event) {
    Chunk chunk = event.getChunk();

    if(!visited(chunk)) {
      System.out.println("new chunk!");
      convertChunk(chunk);
    }
  }

  private boolean visited(Chunk chunk) {
    return visitedChunks.contains(new ChunkCoord(chunk));
  }

  private void convertChunk(Chunk chunk) {
    for (BlockState state : WorldUtil.getBlockStates(chunk)) {
      if (state instanceof CommandBlock) {
        //System.out.println("it's a commandblock");
        CommandBlock cb = (CommandBlock) state;
        String oldCommand = cb.getCommand();
        String newCommand;
        try {
          newCommand = Main.getScriptManager().convertCommand(oldCommand);
        } catch (ScriptException e) {
          newCommand = oldCommand;
          e.printStackTrace();
        }
        cb.setCommand(newCommand);
        cb.update(true);
      }
    }
    visitedChunks.add(new ChunkCoord(chunk));
  }

  private HashSet<ChunkCoord> loadCache() throws FileNotFoundException, IOException {
    File file = new File(Main.getInstance().getDataFolder(), "visisted.txt");

    if (file.exists()) {
      try {
        ObjectInputStream ois = new ObjectInputStream(new FileInputStream(file));
        return (HashSet<ChunkCoord>) ois.readObject();
      } catch (ClassNotFoundException e) {
        return new HashSet<ChunkCoord>();
      }
    } else {
      file.createNewFile();
      return new HashSet<ChunkCoord>();
    }

  }

  public void saveCache() throws FileNotFoundException, IOException {
    File file = new File(Main.getInstance().getDataFolder(), "visisted.txt");
    ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(file));
    oos.writeObject(visitedChunks);
  }
}
