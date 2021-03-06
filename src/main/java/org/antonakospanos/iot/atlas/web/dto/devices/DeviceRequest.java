package org.antonakospanos.iot.atlas.web.dto.devices;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import io.swagger.annotations.ApiModelProperty;
import org.apache.commons.lang3.builder.ReflectionToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.Objects;

/**
 * HeartbeatRequest
 */
@JsonPropertyOrder({ "timestamp", "device" })
public class DeviceRequest {

  @ApiModelProperty(example = "2017-11-19T16:52:40.000 UTC")
  private String timestamp;

  @NotNull
  @Valid
  @ApiModelProperty(required = true)
  private DeviceBaseDto device;

  public DeviceRequest timestamp(String timestamp) {
    this.timestamp = timestamp;
    return this;
  }

   /**
   * Get timestamp
   * @return timestamp
  **/
  public String getTimestamp() {
    return timestamp;
  }

  public void setTimestamp(String timestamp) {
    this.timestamp = timestamp;
  }

  public DeviceRequest device(DeviceDto device) {
    this.device = device;
    return this;
  }

  public DeviceBaseDto getDevice() {
    return device;
  }

  public void setDevice(DeviceBaseDto device) {
    this.device = device;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    DeviceRequest heartbeat = (DeviceRequest) o;
    return Objects.equals(this.timestamp, heartbeat.timestamp) &&
        Objects.equals(this.device, heartbeat.device);
  }

  @Override
  public int hashCode() {
    return Objects.hash(timestamp, device);
  }

  @Override
  public String toString() {
    return ReflectionToStringBuilder.toString(this, ToStringStyle.MULTI_LINE_STYLE);
  }
}

