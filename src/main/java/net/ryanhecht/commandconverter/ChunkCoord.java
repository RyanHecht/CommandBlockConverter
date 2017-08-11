package net.ryanhecht.commandconverter;

import java.io.Serializable;

import org.bukkit.Chunk;

class ChunkCoord implements Serializable {
  /**
   *
   */
  private static final long serialVersionUID = 1L;
  private int x;
  private int z;

  public ChunkCoord(Chunk chunk) {
    this(chunk.getX(), chunk.getZ());
  }

  public ChunkCoord(int x, int z) {
    this.x = x;
    this.z = z;
  }

  @Override
  public int hashCode() {
    final int prime = 31;
    int result = 1;
    result = prime * result + x;
    result = prime * result + z;
    return result;
  }

  @Override
  public boolean equals(Object obj) {
    if (this == obj)
      return true;
    if (obj == null)
      return false;
    if (getClass() != obj.getClass())
      return false;
    ChunkCoord other = (ChunkCoord) obj;
    if (x != other.x)
      return false;
    if (z != other.z)
      return false;
    return true;
  }

  @Override
  public String toString() {
    return this.x + "|" + this.z;
  }

  public static ChunkCoord fromString(String string) {
    String[] split = string.split("|");
    return new ChunkCoord(Integer.parseInt(split[0]), Integer.parseInt(split[1]));
  }



}
