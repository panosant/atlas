package org.antonakospanos.iot.atlas.web.dto.accounts;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import io.swagger.annotations.ApiModelProperty;
import org.antonakospanos.iot.atlas.dao.model.Account;
import org.antonakospanos.iot.atlas.web.dto.Dto;
import org.springframework.stereotype.Component;

import javax.validation.constraints.NotNull;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * AccountDto
 */
@JsonPropertyOrder({ "id", "username", "password", "name", "email", "cellphone", "devices" })
@Component
public class AccountDto extends AccountBaseDto implements Dto<Account> {

	public static List<String> fields = Arrays.asList(AccountBaseDto.class.getDeclaredFields())
			.stream()
			.map(field -> field.getName())
			.collect(Collectors.toList());

	@NotNull
	@ApiModelProperty(example = "accountId", required = true)
	private UUID id;


	public AccountDto() {
	}

	public AccountDto(UUID id, String username, String password, String name, String email, String cellphone, List<String> devices) {
		this.id = id;
		setUsername(username);
		setPassword(password);
		setName(name);
		setEmail(email);
		setCellphone(cellphone);
		setDevices(devices);
	}

	public AccountDto(UUID id, AccountBaseDto accountBaseDto) {
		this(accountBaseDto);
		this.id = id;
	}

	public AccountDto(AccountBaseDto accountBaseDto) {
		super(accountBaseDto.getUsername(), accountBaseDto.getPassword(), accountBaseDto.getName(),
				accountBaseDto.getEmail(), accountBaseDto.getCellphone(), accountBaseDto.getDevices());
	}

	// Factory methods
	public AccountDto id(UUID id) {
		this.id = id;
		return this;
	}

	public AccountDto username(String username) {
		setUsername(username);
		return this;
	}

	public AccountDto password(String password) {
		setPassword(password);
		return this;
	}

	public AccountDto name(String name) {
		setName(name);
		return this;
	}

	public AccountDto email(String email) {
		setEmail(email);
		return this;
	}

	public AccountDto cellphone(String cellphone) {
		setCellphone(cellphone);
		return this;
	}

	public AccountDto devices(List<String> devices) {
		setDevices(devices);
		return this;
	}

	public UUID getId() {
		return id;
	}

	public void setId(UUID id) {
		this.id = id;
	}

	@JsonIgnore
	@ApiModelProperty(hidden = true)
	@Override
	public String getPassword() {
		return super.getPassword();
	}

	@JsonIgnore
	@ApiModelProperty(hidden = true)
	@Override
	public void setPassword(String password) {
		super.setPassword(password);
	}

	@Override
	public AccountDto fromEntity(Account account) {
		this.id = account.getExternalId();

		setUsername(account.getUsername());
		setPassword(account.getPassword());
		setEmail(account.getEmail());
		setName(account.getName());
		setCellphone(account.getCellphone());
		setDevices(account.getDevices()
				.stream()
				.map(device -> device.getExternalId())
				.collect(Collectors.toList()));

		return this;
	}

	@Override
	public Account toEntity() {
		Account account = new Account();

		return toEntity(account);
	}

	@Override
	public Account toEntity(Account account) {
		account.setUsername(this.getUsername());
		account.setName(this.getName());
		account.setEmail(this.getEmail());
		account.setCellphone(this.getCellphone());
		// DAO: Add devices relationship and hash password

		return account;
	}
}
